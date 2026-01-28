'use client';

import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import { Button } from '@/components/ui/Button';
import { FiShield, FiUsers, FiCreditCard, FiActivity, FiArrowRight } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary-light)] selection:text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--primary)] blur-[100px] animate-float"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[var(--secondary)] blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Modern Living, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                Simplified.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--gray-600)] dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience the future of society management with Society360.
              Streamline operations, enhance security, and build a vibrant community—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full px-8 text-lg h-14 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                  Get Started <FiArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg h-14 bg-white/50 backdrop-blur-sm border-gray-200">
                  Live Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl rounded-2xl shadow-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl p-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 aspect-[16/9] flex items-center justify-center relative group cursor-pointer group">
              {/* Abstract UI representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 grid grid-cols-12 gap-6 opacity-80">
                <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full"></div>
                <div className="col-span-9 space-y-6">
                  <div className="flex gap-4">
                    <div className="w-1/3 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50"></div>
                    <div className="w-1/3 h-32 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50"></div>
                    <div className="w-1/3 h-32 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/50"></div>
                  </div>
                  <div className="h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"></div>
                </div>
              </div>
              <div className="z-10 text-center">
                <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-600 group-hover:text-[var(--primary)] transition-colors">Interactive Dashboard Preview</h3>
                <p className="text-gray-400 text-sm mt-2">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to <br /> manage your society.</h2>
            <p className="text-[var(--gray-500)] max-w-xl mx-auto">
              Powerful features designed to make community living effortless and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FiUsers className="w-8 h-8 text-blue-600" />}
              title="Community Connect"
              description="Seamless communication between residents, staff, and administration."
              color="blue"
            />
            <FeatureCard
              icon={<FiShield className="w-8 h-8 text-green-600" />}
              title="Visitor Management"
              description="Secure gate entry with digital passes and real-time visitor tracking."
              color="green"

            />
            <FeatureCard
              icon={<FiCreditCard className="w-8 h-8 text-purple-600" />}
              title="Smart Payments"
              description="Automated billing, expense tracking, and instant payment receipts."
              color="purple"
            />
            <FeatureCard
              icon={<FiActivity className="w-8 h-8 text-orange-600" />}
              title="Quick Resolution"
              description="Efficient helpdesk for maintenance requests and complaint tracking."
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)] opacity-90 z-0"></div>
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to transform your society?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied residents and management teams who trust Society360.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="px-10 py-6 text-lg rounded-full bg-white text-blue-600 hover:bg-gray-100 border-none">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[var(--gray-500)]">
            <p>&copy; 2024 Society360. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-[var(--primary)] transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-[var(--primary)] transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100 group-hover:border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30",
    green: "bg-green-50 border-green-100 group-hover:border-green-200 dark:bg-green-900/10 dark:border-green-900/30",
    purple: "bg-purple-50 border-purple-100 group-hover:border-purple-200 dark:bg-purple-900/10 dark:border-purple-900/30",
    orange: "bg-orange-50 border-orange-100 group-hover:border-orange-200 dark:bg-orange-900/10 dark:border-orange-900/30",
  };

  return (
    <div className={`p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group ${colorClasses[color] || colorClasses.blue}`}>
      <div className="mb-4 inline-block p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-[var(--gray-900)]">{title}</h3>
      <p className="text-[var(--gray-600)] dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
