'use client'

export default function PrivacyPage() {
  return (
    <div className="bg-off-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo/5 to-terracotta/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-bold text-indigo mb-4">
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-8 text-warm-gray">
          <div>
            <h2 className="font-serif text-2xl font-bold text-indigo mb-4">
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, make a purchase, 
              or contact us for support. This may include your name, email address, postal address, phone number, 
              and payment information.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-indigo mb-4">
              How We Use Your Information
            </h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, process transactions, 
              send you service-related announcements, and respond to your inquiries. We do not sell your personal information 
              to third parties.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-indigo mb-4">
              Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet 
              or electronic storage is completely secure.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-indigo mb-4">
              Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal information. You can also opt-out of receiving 
              promotional communications from us at any time by following the instructions in those messages.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-indigo mb-4">
              Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at 
              <a href="mailto:support@giartisans.com" className="text-terracotta hover:underline ml-1">
                support@giartisans.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
