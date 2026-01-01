'use client'

import { useState } from 'react'
import { Shield, FileText, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-slate-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Legal & Privacy</h1>
            </div>
            <p className="text-lg text-slate-600">
              Important information about using RedFlag.buzz
            </p>
          </div>

          {/* Important Notice Card */}
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Important Legal Notice</h3>
                  <p className="text-amber-700 text-sm">
                    RedFlag.buzz is an AI-powered educational tool. The analysis provided is for informational purposes only and should not be used as the sole basis for any decision. You are responsible for your own career choices and outcomes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'terms' | 'privacy')} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Terms of Service
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy Policy
              </TabsTrigger>
            </TabsList>

            {/* Terms of Service Content */}
            <TabsContent value="terms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>RedFlag.buzz User Terms of Service</CardTitle>
                  <CardDescription>Last Updated: January 1, 2026</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">1. Acceptance of Terms</h3>
                    <p className="text-slate-600">
                      By accessing and using RedFlag.buzz ("the Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use the Service.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">2. Service Description</h3>
                    <p className="text-slate-600 mb-3">
                      RedFlag.buzz is an AI-powered tool designed to analyze job descriptions and identify potential risks or "red flags" for job seekers. The Service provides:
                    </p>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                        Automated analysis of job description text
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                        Risk scoring and flag identification
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                        Educational information about potential workplace concerns
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">3. Important Disclaimers</h3>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-slate-800 mb-2">3.1 Informational Purpose Only</h4>
                      <p className="text-slate-600">
                        <strong>The Service is provided for informational and educational purposes only.</strong> The analysis generated by our AI should be treated as:
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          A starting point for further research
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          One perspective among many to consider
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Educational material about potential workplace dynamics
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-slate-800 mb-2">3.2 Not Professional Advice</h4>
                      <p className="text-slate-600">
                        <strong>This is NOT professional career advice, legal advice, or HR consultation.</strong> You should:
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Consult with qualified professionals for important career decisions
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Conduct your own due diligence on employers and job opportunities
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Consider multiple sources of information before making decisions
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-800 mb-2">3.3 No Decision-Making Basis</h4>
                      <p className="text-slate-600">
                        <strong>Do NOT use this Service as the sole basis for any decision.</strong> The analysis:
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Is generated by artificial intelligence and may contain inaccuracies
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Does not consider your personal circumstances, skills, or preferences
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Should not replace human judgment and critical thinking
                        </li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">4. User Responsibilities</h3>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-slate-800 mb-2">4.1 Personal Responsibility</h4>
                      <p className="text-slate-600">
                        You acknowledge and agree that:
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          You are solely responsible for your career decisions and outcomes
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Any risks associated with using the Service are borne by you
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          You will not hold RedFlag.buzz liable for any consequences of your decisions
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-800 mb-2">4.3 Prohibited Uses</h4>
                      <p className="text-slate-600">
                        You agree NOT to use the Service:
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          To harass, defame, or attack any individual or organization
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          As evidence in legal proceedings without independent verification
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          To make false claims about employers or job opportunities
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          For any illegal or unauthorized purpose
                        </li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">6. Limitation of Liability</h3>
                    <p className="text-slate-600">
                      To the maximum extent permitted by law, RedFlag.buzz:
                    </p>
                    <ul className="mt-2 space-y-2 text-slate-600">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                        Makes no warranties about the accuracy or completeness of the analysis
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                        Is not liable for any direct, indirect, or consequential damages
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                        Does not guarantee employment outcomes or career success
                      </li>
                    </ul>
                  </section>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                      For the complete Terms of Service or questions, contact: feedback@koalyn.ai
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Policy Content */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>RedFlag.buzz Privacy Policy</CardTitle>
                  <CardDescription>Last Updated: January 1, 2026</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">1. Introduction</h3>
                    <p className="text-slate-600">
                      RedFlag.buzz ("we," "our," or "the Service") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our job description analysis tool.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">2. Important Privacy Commitment</h3>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">2.1 No Personal Information Collection</h4>
                          <p className="text-green-700">
                            <strong>We do NOT collect, store, or process any personal information from users.</strong> This includes:
                          </p>
                          <ul className="mt-2 space-y-1 text-green-700">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              No registration or account creation required
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              No collection of names, email addresses, or contact information
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              No tracking of user identities or personal details
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              No storage of user profiles or preferences
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">2.2 Anonymous Usage</h4>
                          <p className="text-green-700">
                            The Service is designed to be completely anonymous:
                          </p>
                          <ul className="mt-2 space-y-1 text-green-700">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              You can use the Service without providing any personal data
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              We cannot identify individual users
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              There is no way to link analysis results to specific individuals
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">3. Information Handling</h3>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-slate-800 mb-2">3.1 Job Description Text</h4>
                      <p className="text-slate-600">
                        When you submit a job description for analysis:
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          The text is processed in real-time for analysis
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          <strong>We do NOT store the job description text permanently</strong>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          The analysis is generated and returned to you immediately
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          No record of the specific job description is kept
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-800 mb-2">3.2 Technical Information</h4>
                      <p className="text-slate-600">
                        For operational purposes only, we may collect:
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          <strong>Anonymous, aggregated usage statistics</strong> (e.g., number of analyses per day)
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          <strong>Technical logs</strong> for debugging and service improvement
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          <strong>Performance metrics</strong> to maintain service quality
                        </li>
                      </ul>
                      <p className="mt-3 text-slate-600">
                        All technical data is:
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Completely anonymous and non-identifiable
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Used only for service maintenance and improvement
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Never shared with third parties for marketing or advertising
                        </li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">7. Your Rights</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <p className="text-slate-600">
                        Since we don&apos;t collect personal data:
                      </p>
                      <ul className="mt-2 space-y-2 text-slate-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          There is no personal data to access, correct, or delete
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          You cannot be identified through our Service
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                          Your privacy is inherently protected by our design
                        </li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">10. Compliance</h3>
                    <p className="text-slate-600">
                      This Privacy Policy complies with global privacy standards by design, as we collect no personal information.
                    </p>
                  </section>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                      For privacy-related questions, contact: feedback@koalyn.ai
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Back to Home Button */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="mt-8"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}