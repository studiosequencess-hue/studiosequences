import React from 'react';

const StatsSection = () => {
    return (
        <section id={"home-stats-section"} className="py-20 px-6 text-white">
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
    );
};

export default StatsSection;