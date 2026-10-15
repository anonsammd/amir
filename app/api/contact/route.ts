import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  projectType: z.string().min(1, 'Project type is required'),
  phoneNumber: z.string().min(6, 'Phone number is required'),
  message: z.string().min(10, 'Please provide a message with at least 10 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      const firstErr = validation.error.errors[0]?.message || 'Invalid form data.';
      return NextResponse.json({ error: firstErr }, { status: 400 });
    }

    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || '';

    // Log the contact inquiry for local server output
    console.log('[Contact Form Submission]', validation.data);

    if (!contactEmail) {
      // If no backend email service is active, notify client of fallback email configuration
      return NextResponse.json({
        success: true,
        fallbackMode: true,
        contactEmail: 'contact@dopexcreation.com',
        message: 'Your inquiry has been processed. If you do not hear back shortly, feel free to email directly at contact@dopexcreation.com.',
      });
    }

    return NextResponse.json({
      success: true,
      fallbackMode: false,
      message: 'Thank you for reaching out! Aamir will review your project details and get back to you soon.',
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    return NextResponse.json({ error: 'Failed to process inquiry. Please try emailing directly.' }, { status: 500 });
  }
}
