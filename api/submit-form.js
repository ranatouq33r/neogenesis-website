import { Resend } from 'resend';

// Vercel automatically injects your environment variables here securely
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // These keys match the properties mapped in your frontend script payload
    const { fullName, workEmail, company, platform, projectBrief } = req.body;

    // Send the email using Resend
    const data = await resend.emails.send({
      from: 'NeoGenesis <info@neogenesisltd.com>', // Replace with your verified domain in production
      to: 'ranatouqeer@neogenesisltd.com', // Where you want to receive notifications
      subject: `New Session Request from ${fullName}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">New Project Inquiry</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Work Email:</strong> ${workEmail}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Platform:</strong> ${platform || 'Not provided'}</p>
          
          <div style="margin-top: 20px; padding: 15px; bg-color: #f9f9f9; border-left: 4px solid #1ce79b;">
            <strong>Project Brief:</strong><br/>
            <p style="white-space: pre-wrap; margin-top: 5px;">${projectBrief || 'No brief provided.'}</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}