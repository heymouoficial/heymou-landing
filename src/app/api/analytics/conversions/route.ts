import { NextRequest, NextResponse } from 'next/server';

interface ConversionData {
    type: 'contact_form' | 'newsletter_signup' | 'service_inquiry' | 'download' | 'phone_call';
    value?: number;
    currency?: string;
    formName?: string;
    formFields?: Record<string, string | number | boolean>;
    completionTime?: number;
    validationErrors?: string[];
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
    timestamp: number;
    url: string;
    userAgent: string;
    sessionId: string;
    additionalData?: Record<string, string | number | boolean>;
}

export async function POST(request: NextRequest) {
    try {
        const body: ConversionData = await request.json();

        // Validate the incoming data
        if (!body.type || !body.timestamp) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Add request metadata
        const conversionLog = {
            ...body,
            ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            request_user_agent: request.headers.get('user-agent'),
            request_timestamp: Date.now(),
            referer: request.headers.get('referer'),
        };

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('🎯 Conversion Tracked:', {
                type: body.type,
                formName: body.formName,
                value: body.value,
                completionTime: body.completionTime,
                timestamp: new Date(body.timestamp).toISOString(),
                url: body.url,
                sessionId: body.sessionId,
            });
        }

        // In production, you would:
        // 1. Store conversion data in database
        // 2. Send to analytics platforms (Google Analytics, Facebook Pixel, etc.)
        // 3. Trigger marketing automation workflows
        // 4. Update lead scoring systems
        // 5. Send notifications to sales team

        // Example: Store in database
        // await db.conversions.create({
        //   data: {
        //     type: body.type,
        //     value: body.value || 0,
        //     formName: body.formName,
        //     formData: body.formFields,
        //     completionTime: body.completionTime,
        //     sessionId: body.sessionId,
        //     url: body.url,
        //     userAgent: body.userAgent,
        //     timestamp: new Date(body.timestamp),
        //     source: body.source,
        //     medium: body.medium,
        //     campaign: body.campaign,
        //     metadata: conversionLog,
        //   }
        // });

        // Example: Send to external analytics services
        await Promise.allSettled([
            sendToGoogleAnalytics(conversionLog),
            sendToFacebookPixel(conversionLog),
            sendToMarketingAutomation(conversionLog),
            sendToSlackNotification(conversionLog),
        ]);

        return NextResponse.json({
            success: true,
            conversionId: generateConversionId(body),
        });
    } catch {
        // eslint-disable-next-line no-console
        console.error('Error processing conversion');
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Send conversion to Google Analytics
async function sendToGoogleAnalytics(conversionData: ConversionData & { ip_address?: string | null }) {
    const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-N47CGV5F2N';
    if (!process.env.GA_API_SECRET) return;

    try {
        const payload = {
            client_id: conversionData.sessionId,
            events: [
                {
                    name: 'conversion',
                    params: {
                        conversion_type: conversionData.type,
                        value: conversionData.value || 0,
                        currency: conversionData.currency || 'USD',
                        form_name: conversionData.formName,
                        completion_time: conversionData.completionTime,
                        page_location: conversionData.url,
                        session_id: conversionData.sessionId,
                    },
                },
            ],
        };

        await fetch(
            `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );
    } catch {
        // Silently fail
    }
}

// Send conversion to Facebook Pixel
async function sendToFacebookPixel(conversionData: ConversionData & { ip_address?: string | null }) {
    if (!process.env.FACEBOOK_PIXEL_ID || !process.env.FACEBOOK_ACCESS_TOKEN) return;

    try {
        const payload = {
            data: [
                {
                    event_name: 'Lead',
                    event_time: Math.floor(conversionData.timestamp / 1000),
                    action_source: 'website',
                    event_source_url: conversionData.url,
                    user_data: {
                        client_ip_address: conversionData.ip_address,
                        client_user_agent: conversionData.userAgent,
                    },
                    custom_data: {
                        content_name: conversionData.formName,
                        value: conversionData.value || 0,
                        currency: conversionData.currency || 'USD',
                    },
                },
            ],
        };

        await fetch(
            `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PIXEL_ID}/events`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FACEBOOK_ACCESS_TOKEN}`,
                },
                body: JSON.stringify(payload),
            }
        );
    } catch {
        // Silently fail
    }
}

// Send to marketing automation platform
async function sendToMarketingAutomation(conversionData: ConversionData & { ip_address?: string | null }) {
    if (!process.env.MARKETING_AUTOMATION_WEBHOOK_URL) return;

    try {
        const payload = {
            event: 'conversion',
            type: conversionData.type,
            contact: {
                email: conversionData.formFields?.email,
                name: conversionData.formFields?.name,
                company: conversionData.formFields?.company,
                phone: conversionData.formFields?.phone,
            },
            properties: {
                form_name: conversionData.formName,
                service_interest: conversionData.formFields?.service,
                budget: conversionData.formFields?.budget,
                timeline: conversionData.formFields?.timeline,
                message: conversionData.formFields?.message,
                completion_time: conversionData.completionTime,
                lead_score: conversionData.value,
                source: conversionData.source,
                medium: conversionData.medium,
                campaign: conversionData.campaign,
                page_url: conversionData.url,
                session_id: conversionData.sessionId,
                timestamp: conversionData.timestamp,
            },
        };

        await fetch(process.env.MARKETING_AUTOMATION_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MARKETING_AUTOMATION_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });
    } catch {
        // Silently fail
    }
}

// Send Slack notification for high-value conversions
async function sendToSlackNotification(conversionData: ConversionData & { ip_address?: string | null }) {
    if (!process.env.SLACK_WEBHOOK_URL) return;

    // Only notify for high-value conversions
    if (!conversionData.value || conversionData.value < 70) return;

    try {
        const message = {
            text: '🎯 High-Value Lead Conversion!',
            attachments: [
                {
                    color: 'good',
                    fields: [
                        {
                            title: 'Form',
                            value: conversionData.formName || 'Unknown',
                            short: true,
                        },
                        {
                            title: 'Lead Score',
                            value: `${conversionData.value}/100`,
                            short: true,
                        },
                        {
                            title: 'Contact',
                            value: conversionData.formFields?.email || 'No email provided',
                            short: true,
                        },
                        {
                            title: 'Company',
                            value: conversionData.formFields?.company || 'Not provided',
                            short: true,
                        },
                        {
                            title: 'Service Interest',
                            value: conversionData.formFields?.service || 'General inquiry',
                            short: true,
                        },
                        {
                            title: 'Budget',
                            value: conversionData.formFields?.budget || 'Not specified',
                            short: true,
                        },
                        {
                            title: 'Message Preview',
                            value: typeof conversionData.formFields?.message === 'string'
                                ? conversionData.formFields.message.substring(0, 100) + '...'
                                : 'No message',
                            short: false,
                        },
                        {
                            title: 'Page URL',
                            value: conversionData.url,
                            short: false,
                        },
                    ],
                    footer: 'HeyMou Analytics',
                    ts: Math.floor(conversionData.timestamp / 1000),
                },
            ],
        };

        await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    } catch {
        // Silently fail
    }
}

// Generate unique conversion ID
function generateConversionId(conversionData: ConversionData): string {
    const timestamp = conversionData.timestamp;
    const type = conversionData.type;
    const sessionId = conversionData.sessionId.substring(0, 8);
    return `${type}_${timestamp}_${sessionId}`;
}

// Handle preflight requests for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}