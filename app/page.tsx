import SafeImage from "@/components/partials/safe-image";
import HeroSection from "@/components/pages/home/hero-section";
import CtaSection from "@/components/pages/home/cta-section";

export default function Home() {
    return (
        <div className={"flex flex-col"}>
            <HeroSection />

            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 className="font-display text-4xl font-bold mb-4">Featured Creative Work</h3>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explore exceptional work from talented professionals and studios worldwide
                        </p>
                    </div>

                    <div className="masonry-grid">
                        <div className="masonry-item portfolio-card rounded-xl overflow-hidden shadow-lg">
                            <div className="relative">
                                <div className={"relative h-64 w-full"}>
                                    <SafeImage src="/images/project-1.jpg" alt="Alex Chen's VFX Work" className={"h-64 w-full"}/>
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className="verified-badge">Verified</span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-black bg-opacity-70 text-white p-3 rounded-lg">
                                        <h4 className="font-semibold mb-1">Cyberpunk City VFX</h4>
                                        <p className="text-sm opacity-90">Environmental Effects • Maya, Houdini</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center mb-3">
                                    <SafeImage src="/images/avatar-1.jpg" alt="Alex Chen" className="w-10 h-10 rounded-full mr-3"/>
                                    <div>
                                        <h5 className="font-semibold">Alex Chen</h5>
                                        <p className="text-sm text-gray-600">Senior VFX Artist</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">Dynamic cityscape with advanced particle systems and atmospheric effects for
                                    feature
                                    film.</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Available for projects</span>
                                    <span>Vancouver, BC</span>
                                </div>
                            </div>
                        </div>

                        <div className="masonry-item portfolio-card rounded-xl overflow-hidden shadow-lg">
                            <div className="relative">
                                <SafeImage src="/images/project-2.jpg" alt="Maria Santos Character Design" className="w-full h-80 object-cover"/>
                                <div className="absolute top-4 left-4">
                                    <span className="verified-badge">Verified</span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-black bg-opacity-70 text-white p-3 rounded-lg">
                                        <h4 className="font-semibold mb-1">Fantasy Character Concepts</h4>
                                        <p className="text-sm opacity-90">Character Design • Photoshop, ZBrush</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center mb-3">
                                    <SafeImage src="/images/avatar-2.jpg" alt="Maria Santos" className="w-10 h-10 rounded-full mr-3"/>
                                    <div>
                                        <h5 className="font-semibold">Maria Santos</h5>
                                        <p className="text-sm text-gray-600">Character Designer</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">Original character designs with expressive features and compelling
                                    storytelling
                                    elements.</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Available soon</span>
                                    <span>Los Angeles, CA</span>
                                </div>
                            </div>
                        </div>

                        <div className="masonry-item portfolio-card rounded-xl overflow-hidden shadow-lg">
                            <div className="relative">
                                <SafeImage src="/images/project-3.jpg" alt="David Kim Motion Graphics" className="w-full h-56 object-cover"/>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-black bg-opacity-70 text-white p-3 rounded-lg">
                                        <h4 className="font-semibold mb-1">Abstract Motion Graphics</h4>
                                        <p className="text-sm opacity-90">Motion Design • After Effects, C4D</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center mb-3">
                                    <SafeImage src="/images/avatar-3.jpg" alt="David Kim" className="w-10 h-10 rounded-full mr-3"/>
                                    <div>
                                        <h5 className="font-semibold">David Kim</h5>
                                        <p className="text-sm text-gray-600">Motion Designer</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">Dynamic visual effects and typography for commercial projects and broadcast
                                    design.</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Available for projects</span>
                                    <span>New York, NY</span>
                                </div>
                            </div>
                        </div>

                        <div className="masonry-item portfolio-card rounded-xl overflow-hidden shadow-lg">
                            <div className="relative">
                                <SafeImage src="/images/hero-company.jpg" alt="Sun Creature Studio Work" className="w-full h-48 object-cover"/>
                                <div className="absolute top-4 left-4">
                                    <SafeImage src="/images/company-logo-1.png" alt="Sun Creature" className="w-12 h-12 rounded-lg bg-white p-2"/>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className="verified-badge">Verified</span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-black bg-opacity-70 text-white p-3 rounded-lg">
                                        <h4 className="font-semibold mb-1">What If...? Season 3</h4>
                                        <p className="text-sm opacity-90">TV Series • 2D FX Animation</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h5 className="font-semibold text-lg mb-2">Sun Creature Studio</h5>
                                <p className="text-sm text-gray-600 mb-3">Animation Studio • Copenhagen, Denmark</p>
                                <p className="text-sm text-gray-700 mb-3">2D FX animation for Marvel Studios&apos; animated series featuring alternate
                                    realities and
                                    dynamic action sequences.</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">50+ employees</span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Hiring</span>
                                </div>
                            </div>
                        </div>

                        <div className="masonry-item portfolio-card rounded-xl overflow-hidden shadow-lg">
                            <div className="relative">
                                <SafeImage src="/images/project-1.jpg" alt="Sarah Johnson 3D Work" className="w-full h-72 object-cover"/>
                                <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2">
                                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                              clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-black bg-opacity-70 text-white p-3 rounded-lg">
                                        <h4 className="font-semibold mb-1">3D Environment Design</h4>
                                        <p className="text-sm opacity-90">Environment Art • Blender, Substance</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center mb-3">
                                    <SafeImage src="/images/avatar-1.jpg" alt="Sarah Johnson" className="w-10 h-10 rounded-full mr-3"/>
                                    <div>
                                        <h5 className="font-semibold">Sarah Johnson</h5>
                                        <p className="text-sm text-gray-600">3D Artist</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">Immersive 3D environments and characters for games and virtual production
                                    pipelines.</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Available for projects</span>
                                    <span>Toronto, ON</span>
                                </div>
                            </div>
                        </div>

                        <div className="masonry-item portfolio-card rounded-xl overflow-hidden shadow-lg">
                            <div className="relative">
                                <SafeImage src="/images/project-2.jpg" alt="Elena Rodriguez Storyboards" className="w-full h-64 object-cover"/>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-black bg-opacity-70 text-white p-3 rounded-lg">
                                        <h4 className="font-semibold mb-1">Storyboard Sequences</h4>
                                        <p className="text-sm opacity-90">Storyboarding • Storyboard Pro</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center mb-3">
                                    <SafeImage src="/images/avatar-2.jpg" alt="Elena Rodriguez" className="w-10 h-10 rounded-full mr-3"/>
                                    <div>
                                        <h5 className="font-semibold">Elena Rodriguez</h5>
                                        <p className="text-sm text-gray-600">Storyboard Artist</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">Visual storytelling through dynamic storyboards and concept art for film and
                                    animation.</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Available soon</span>
                                    <span>Montreal, QC</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-pattern">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="font-display text-4xl font-bold mb-4">Why Choose Studio Sequence?</h3>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Professional tools designed specifically for creative industries
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="feature-card rounded-2xl p-8 shadow-lg text-center">
                            <div className="w-16 h-16 bg-accent-terracotta rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                            </div>
                            <h4 className="font-display text-xl font-bold mb-3">Portfolio Showcase</h4>
                            <p className="text-gray-600">Beautiful, customizable portfolios that highlight your best work with professional
                                presentation.</p>
                        </div>

                        <div className="feature-card rounded-2xl p-8 shadow-lg text-center">
                            <div className="w-16 h-16 bg-accent-sage rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <h4 className="font-display text-xl font-bold mb-3">Advanced Search</h4>
                            <p className="text-gray-600">Find the perfect talent or opportunities with location-based search and detailed
                                filtering.</p>
                        </div>

                        <div className="feature-card rounded-2xl p-8 shadow-lg text-center">
                            <div className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <h4 className="font-display text-xl font-bold mb-3">Professional Network</h4>
                            <p className="text-gray-600">Connect with peers, mentors, and industry leaders in the creative community.</p>
                        </div>

                        <div className="feature-card rounded-2xl p-8 shadow-lg text-center">
                            <div className="w-16 h-16 bg-accent-terracotta rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h4 className="font-display text-xl font-bold mb-3">Job Opportunities</h4>
                            <p className="text-gray-600">Find freelance, contract, and full-time opportunities tailored to your skills.</p>
                        </div>

                        <div className="feature-card rounded-2xl p-8 shadow-lg text-center">
                            <div className="w-16 h-16 bg-accent-sage rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <h4 className="font-display text-xl font-bold mb-3">Analytics & Insights</h4>
                            <p className="text-gray-600">Track your portfolio performance and gain insights into industry trends.</p>
                        </div>

                        <div className="feature-card rounded-2xl p-8 shadow-lg text-center">
                            <div className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h4 className="font-display text-xl font-bold mb-3">Privacy & Security</h4>
                            <p className="text-gray-600">Control your content visibility and protect your intellectual property.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-section py-20 px-6 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">10,000+</div>
                            <div className="text-lg">Creative Professionals</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">2,500+</div>
                            <div className="text-lg">Companies & Studios</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50,000+</div>
                            <div className="text-lg">Portfolio Projects</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">15,000+</div>
                            <div className="text-lg">Job Opportunities</div>
                        </div>
                    </div>
                </div>
            </section>

            <CtaSection/>
        </div>
    );
}
