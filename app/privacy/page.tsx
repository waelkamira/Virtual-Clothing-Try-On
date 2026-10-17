import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
        </div>

        <div className="prose prose-orange max-w-none">
          <p className="lead">Last updated: June 1, 2023</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to Virtual Style Studio ("we," "our," or "us"). We are committed to protecting your privacy and
            ensuring you have a positive experience on our website and while using our virtual try-on services.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
            our website or use our virtual try-on application, including any other media form, media channel, mobile
            website, or mobile application related or connected thereto (collectively, the "Service").
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please
            do not access the Service.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Personal Data</h3>
          <p>
            We may collect personal information that you voluntarily provide to us when you register for the Service,
            express an interest in obtaining information about us or our products and Services, participate in
            activities on the Service, or otherwise contact us. The personal information we collect may include:
          </p>
          <ul>
            <li>Name, email address, and contact details</li>
            <li>Username and password</li>
            <li>Profile information (such as profile pictures)</li>
            <li>Body measurements and sizing information</li>
            <li>Payment information (processed securely through our payment processors)</li>
            <li>Preferences and feedback</li>
          </ul>

          <h3>2.2 Images and Body Data</h3>
          <p>Our virtual try-on service may collect and process:</p>
          <ul>
            <li>Photos or images you upload for virtual try-on purposes</li>
            <li>Body measurements you provide or that are calculated based on your images</li>
            <li>3D body models created from your images or measurements</li>
          </ul>
          <p>We take the privacy of this data very seriously and implement strict security measures to protect it.</p>

          <h3>2.3 Automatically Collected Information</h3>
          <p>
            When you access our Service, we may automatically collect certain information about your device and usage of
            the Service, including:
          </p>
          <ul>
            <li>Device information (such as your mobile device ID, model, and manufacturer)</li>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Time zone setting and location</li>
            <li>Pages of our Service that you visit</li>
            <li>Time spent on those pages</li>
            <li>Information about how you use our Service</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including:</p>
          <ul>
            <li>Providing, operating, and maintaining our Service</li>
            <li>Creating and managing your account</li>
            <li>Providing the virtual try-on functionality</li>
            <li>Processing transactions and sending related information</li>
            <li>Sending administrative information</li>
            <li>Responding to inquiries and offering support</li>
            <li>Improving and personalizing the user experience</li>
            <li>Developing new products, services, features, and functionality</li>
            <li>Communicating with you about updates, security alerts, and support</li>
            <li>Marketing and promotional purposes (with your consent)</li>
            <li>Analyzing usage patterns and trends</li>
            <li>Protecting against fraudulent, unauthorized, or illegal activity</li>
          </ul>

          <h2>4. Sharing Your Information</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers who perform services on our behalf</li>
            <li>Business partners with your consent</li>
            <li>Affiliated companies within our corporate family</li>
            <li>Third parties in connection with a business transaction</li>
            <li>Law enforcement or other authorities if required by law</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>

          <h2>5. Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the
            security of any personal information we process. However, despite our safeguards and efforts to secure your
            information, no electronic transmission over the Internet or information storage technology can be
            guaranteed to be 100% secure.
          </p>

          <h2>6. Your Privacy Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to request deletion of your data</li>
            <li>Right to restrict processing of your data</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>

          <h2>7. Children's Privacy</h2>
          <p>
            Our Service is not directed to children under 13 (or 16 in certain jurisdictions). We do not knowingly
            collect personal information from children. If you are a parent or guardian and believe your child has
            provided us with personal information, please contact us.
          </p>

          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2>9. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
          <p>
            Virtual Style Studio
            <br />
            Email: privacy@virtualstylestudio.com
            <br />
            Address: 123 Fashion Avenue, Suite 100, New York, NY 10001
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

