import SafeImage from "@/components/partials/safe-image";
import HeroSection from "@/components/pages/home/hero-section";
import CtaSection from "@/components/pages/home/cta-section";
import StatsSection from "@/components/pages/home/stats-section";
import Features from "@/components/pages/home/features";

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

            <Features/>
            <StatsSection/>
            <CtaSection/>
        </div>
    );
}
