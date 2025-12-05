
import React, { useEffect } from 'react';
import { LampContainer } from '../components/ui/lamp';
import { Typewriter } from '../components/ui/typewriter';
import { motion } from 'framer-motion';
import { Brain, Cpu, Map, Target, TrendingUp, Grid3x3, Calendar, Shield, BarChart3, Calculator, Users, CheckCircle, Zap, FileText, Database } from 'lucide-react';
import { EnhancedAnimatedStats } from '../components/ui/enhanced-animated-stats';

// Import all images
import accuracyImg from '../assets/accuarcy.jpg';
import heterogeneityImg from '../assets/heterogenity.jpg';
import stateDependenceImg from '../assets/state_dependance.jpg';
import positiveImg from '../assets/positive.jpg';
import peiImg from '../assets/pei.jpg';
import crimeHotspotImg from '../assets/crime_hotspot.jpg';
import preSortImg from '../assets/pre_sort.jpg';
import sortedImg from '../assets/sorted.jpg';

// Section Anchor Component for navigation
const SectionAnchor: React.FC<{
  id: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className = "" }) => {
  useEffect(() => {
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    if (scrollToSection === id) {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -100; // Adjust for navbar
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          sessionStorage.removeItem('scrollToSection');
        }
      }, 300);
    }
  }, [id]);

  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
};

const OurWorkPage = () => {
  const researchMetrics = [
    { label: "Prediction Efficiency", value: 74.9, suffix: "%", icon: TrendingUp, color: "text-blue-400", duration: 2500 },
    { label: "Hotspot Accuracy", value: 76.2, suffix: "%", icon: Target, color: "text-green-400", duration: 2200 },
    { label: "Grid Cells Analyzed", value: 11548, suffix: "", icon: Grid3x3, color: "text-purple-400", duration: 3000 },
    { label: "Cities in Study", value: 2, suffix: "", icon: Map, color: "text-amber-400", duration: 1500 },
  ];

  const simpleSteps = [
    {
      number: "1",
      title: "Divide the City",
      description: "Split Portland into 11,548 grid cells (250m x 250m)",
      icon: Grid3x3,
      color: "text-blue-400",
      details: "Each square becomes a tiny neighborhood for analysis"
    },
    {
      number: "2",
      title: "Track Monthly Crime",
      description: "Count crimes in each cell across 63 months",
      icon: Calendar,
      color: "text-green-400",
      details: "Create temporal crime patterns for each location"
    },
    {
      number: "3",
      title: "Calculate True Positive Rates",
      description: "Compute ATP (Average True Positive) for each grid cell",
      icon: Calculator,
      color: "text-purple-400",
      details: "Measure historical prediction accuracy"
    },
    {
      number: "4",
      title: "Apply Lee Algorithm",
      description: "Combine Population Heterogeneity + State Dependence",
      icon: Brain,
      color: "text-amber-400",
      details: "Sort cells by ATP, then by recent crime activity"
    },
    {
      number: "5",
      title: "Generate Hotspot Predictions",
      description: "Output ranked list of predicted crime hotspots",
      icon: CheckCircle,
      color: "text-red-400",
      details: "Forecast where crimes will occur next month"
    }
  ];

  const datasets = [
    {
      city: "Portland, OR",
      period: "2012-2017",
      cells: "11,548",
      crimes: "500,000+",
      status: "Primary Testbed",
      color: "from-blue-500/20 to-blue-900/20",
      iconColor: "bg-blue-500"
    },
    {
      city: "Sarasota, FL",
      period: "2018-2023",
      cells: "6,432",
      crimes: "200,000+",
      status: "Current MLP Research",
      color: "from-green-500/20 to-green-900/20",
      iconColor: "bg-green-500"
    }
  ];

  const crimeTypes = [
    {
      name: "All Crimes",
      pei: 66.5,
      accuracy: 44.6,
      description: "Overall prediction across all crime types"
    },
    {
      name: "Property Crimes",
      pei: 74.9,
      accuracy: 61.0,
      description: "Theft, burglary, property damage"
    },
    {
      name: "Violent Crimes",
      pei: 60.8,
      accuracy: 37.6,
      description: "Assault, robbery, other violent offenses"
    },
    {
      name: "Car Thefts",
      pei: 51.8,
      accuracy: 17.3,
      description: "Motor vehicle theft specifically"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section - Fixed Lamp Container */}
      <section className="relative pt-20 min-h-[80vh] flex items-center justify-center overflow-hidden">
        <LampContainer className="absolute inset-0">
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="mt-8 bg-gradient-to-br from-blue-400 to-cyan-300 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Making Cities Safer
            <br />
            With Simple Math
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 text-xl text-white/70 text-center max-w-2xl mx-auto px-4"
          >
            <Typewriter
              text={[
                "From Portland proof-of-concept to Sarasota MLP enhancement",
                "No AI needed - just Excel and common sense",
                "Predict crime hotspots with 75% accuracy",
                "Simple enough for any police department to use"
              ]}
              speed={60}
              className="text-cyan-300"
              waitTime={2000}
              deleteSpeed={40}
              cursorChar="_"
            />
          </motion.p>

          {/* MLP Coming Soon Banner */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 text-lg text-amber-300 text-center max-w-xl mx-auto px-4 border border-amber-500/20 rounded-lg py-3 bg-amber-500/5"
          >
            <span className="font-semibold">AI Enhancement in Progress:</span> MLP Neural Network being trained on Sarasota data,
            targeting <span className="text-green-300 font-semibold">89%+ accuracy</span>
          </motion.p>
        </LampContainer>
      </section>

      {/* Simple Introduction */}
      <section className="py-20 container mx-auto px-6 relative z-10 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">From Portland Proof to Sarasota AI</h2>
          <p className="text-white/60 text-lg max-w-3xl mx-auto">
            Starting with Portland's proven Lee Algorithm, we're now enhancing predictions with MLP neural networks using Sarasota data.
            Simple math meets advanced AI for better crime forecasting.
          </p>
        </motion.div>

        <EnhancedAnimatedStats stats={researchMetrics} />
      </section>

      {/* Datasets Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Database className="w-10 h-10 text-blue-400" />
              <h2 className="text-4xl font-bold">Dual-City Research Approach</h2>
            </div>
            <p className="text-white/60 max-w-2xl mx-auto">
              Portland established the baseline, Sarasota drives the AI enhancement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {datasets.map((dataset, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-gradient-to-br ${dataset.color} to-black border-2 border-gray-800 rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${dataset.iconColor} flex items-center justify-center`}>
                    {index === 0 ? (
                      <Map className="w-6 h-6 text-white" />
                    ) : (
                      <Cpu className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{dataset.city}</h3>
                    <p className="text-white/70 text-sm">{dataset.status}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Study Period:</span>
                    <span className="text-white font-semibold">{dataset.period}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Grid Cells:</span>
                    <span className="text-white font-semibold">{dataset.cells}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Crime Incidents:</span>
                    <span className="text-white font-semibold">{dataset.crimes}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="text-sm text-white/60">
                    {index === 0 ?
                      "Established Lee Algorithm baseline with 74.9% PEI" :
                      "Current MLP neural network training for enhanced accuracy"
                    }
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Algorithm Visualization Section */}
      <section className="py-20 container mx-auto px-6 relative z-10 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-blue-400" />
            <h2 className="text-4xl font-bold">Lee Algorithm Workflow</h2>
          </div>
          <p className="text-white/60 max-w-2xl mx-auto">
            How unsorted crime data becomes ordered hotspot predictions
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* STEP 1: Pre-Sorted Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Raw Grid Data</h3>
                  <p className="text-white/70">Unordered crime counts across grid cells</p>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border-2 border-blue-800/50 bg-gradient-to-br from-black to-gray-900 p-8 min-h-[400px] flex items-center justify-center">
                <img
                  src={preSortImg}
                  alt="Unsorted grid cells showing raw crime data"
                  className="w-full h-full object-contain max-h-[350px]"
                />
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-white/70">
                  <span className="text-blue-300 font-semibold">Initial State:</span> Each grid cell contains crime counts but no ordering.
                  The algorithm starts with this unstructured spatial data.
                </p>
              </div>
            </div>
          </motion.div>

          {/* STEP 2: Positive Sorting */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Calculate True Positive Rates</h3>
                  <p className="text-white/70">Compute ATP (Average True Positive) for each cell</p>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-800/50 bg-gradient-to-br from-black to-gray-900 p-8 min-h-[400px] flex items-center justify-center">
                <img
                  src={positiveImg}
                  alt="Grid cells ordered by true positive rates"
                  className="w-full h-full object-contain max-h-[350px]"
                />
              </div>

              <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-white/70">
                  <span className="text-purple-300 font-semibold">Population Heterogeneity:</span>
                  Cells are ordered by their historical accuracy (ATP scores).
                  High ATP cells (consistently accurate predictions) move to the top.
                </p>
              </div>
            </div>
          </motion.div>

          {/* STEP 3: Sorted Predictions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Final Sorted Predictions</h3>
                  <p className="text-white/70">Ordered list of predicted crime hotspots</p>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border-2 border-green-800/50 bg-gradient-to-br from-black to-gray-900 p-8 min-h-[400px] flex items-center justify-center">
                <img
                  src={sortedImg}
                  alt="Final sorted predictions showing ranked hotspots"
                  className="w-full h-full object-contain max-h-[350px]"
                />
              </div>

              <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-white/70">
                  <span className="text-green-300 font-semibold">State Dependence + Tie-Breaking:</span>
                  After ATP ordering, cells with recent crimes move up.
                  The final sorted list represents our hotspot predictions for the next month.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-900/10 rounded-xl">
                  <div className="text-blue-300 font-semibold mb-2">Portland Results</div>
                  <p className="text-white/70 text-sm">
                    This workflow achieved 74.9% PEI for property crime prediction
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-900/10 rounded-xl">
                  <div className="text-green-300 font-semibold mb-2">Sarasota MLP Goal</div>
                  <p className="text-white/70 text-sm">
                    MLP neural network aims for 89%+ accuracy using this same data structure
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MLP Coming Soon Section - ID: mlp-section */}
      <SectionAnchor id="mlp-section" className="py-16 container mx-auto px-6 relative z-10 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-800/30 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <div className="p-4 bg-purple-500/20 rounded-2xl">
                <Cpu className="w-12 h-12 text-purple-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-2">MLP Neural Network Enhancement</h3>
                <p className="text-white/70">Taking Portland's success to Sarasota with deep learning</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 bg-gradient-to-br from-purple-900/10 to-black rounded-xl border border-purple-800/20">
                <h4 className="text-xl font-semibold text-purple-300 mb-4">Current Sarasota Research</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-amber-300 font-medium">Active Training Phase</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    Building on Portland's Lee Algorithm success, we're training MLP neural networks
                    with Sarasota's 2018-2023 crime data for enhanced pattern recognition.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-900/10 to-black rounded-xl border border-green-800/20">
                <h4 className="text-xl font-semibold text-green-300 mb-4">MLP Architecture</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-white"><span className="text-green-400 font-bold">20-60 temporal features</span> (monthly/weekly crime patterns)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-white"><span className="text-green-400 font-bold">128-64-1 hidden layers</span> with ReLU activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-white"><span className="text-green-400 font-bold">Dropout + BatchNorm</span> for regularization</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-900/10 to-black rounded-xl border border-blue-800/20">
              <h4 className="text-xl font-semibold text-blue-300 mb-3">Research Progression</h4>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg w-full">
                  <div className="text-2xl font-bold text-blue-300">2019-2022</div>
                  <div className="text-lg font-semibold text-white mt-2">Portland Proof</div>
                  <div className="text-sm text-gray-400 mt-1">Lee Algorithm: 74.9% PEI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-purple-400">→</div>
                  <div className="text-sm text-purple-300 mt-1">Algorithm Established</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg w-full">
                  <div className="text-2xl font-bold text-purple-300">2023</div>
                  <div className="text-lg font-semibold text-white mt-2">Sarasota Expansion</div>
                  <div className="text-sm text-gray-400 mt-1">Data Collection & Prep</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-green-400">→</div>
                  <div className="text-sm text-green-300 mt-1">AI Integration</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg w-full">
                  <div className="text-2xl font-bold text-green-300">2024</div>
                  <div className="text-lg font-semibold text-white mt-2">MLP Enhancement</div>
                  <div className="text-sm text-gray-400 mt-1">89%+ Target Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionAnchor>

      {/* Lee Algorithm Section - ID: lee-algorithm-section */}
      <SectionAnchor id="lee-algorithm-section" className="py-20 bg-gradient-to-b from-black to-gray-900 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Lee Algorithm: Two Simple Rules Explain Crime</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              After studying Portland's crime data, we found two basic patterns that explain where crimes happen
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Rule 1: Population Heterogeneity */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-900/20 to-black border-2 border-blue-800/30 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Rule #1: Bad Areas Stay Bad</h3>
                    <p className="text-white/70 text-sm">"Population Heterogeneity"</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-blue-800/50 bg-gradient-to-br from-black to-gray-900 p-8 min-h-[400px] flex items-center justify-center">
                    <img
                      src={heterogeneityImg}
                      alt="Population Heterogeneity Diagram showing three types of neighborhoods"
                      className="w-full h-full object-contain max-h-[350px]"
                    />
                  </div>
                  <p className="text-white/60 text-sm mt-4">
                    <strong>Simple version:</strong> Some neighborhoods naturally have more crime because of their
                    people, buildings, and location. These "bad areas" tend to stay bad over time.
                  </p>
                </div>

                <div className="p-5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="font-semibold text-blue-300 mb-3">What this means for police:</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                      <span>Certain areas need constant police attention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                      <span>Crime patterns are stable and predictable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                      <span>Resources should be allocated based on area type</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Rule 2: State Dependence */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-800/30 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Rule #2: Crime Begets Crime</h3>
                    <p className="text-white/70 text-sm">"State Dependence"</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-purple-800/50 bg-gradient-to-br from-black to-gray-900 p-8 min-h-[400px] flex items-center justify-center">
                    <img
                      src={stateDependenceImg}
                      alt="State Dependence Timeline showing crime probability spikes"
                      className="w-full h-full object-contain max-h-[350px]"
                    />
                  </div>
                  <p className="text-white/60 text-sm mt-4">
                    <strong>Simple version:</strong> When a crime happens somewhere, that place becomes
                    more likely to have another crime soon after. It's like a temporary "crime fever" that
                    slowly goes away if no more crimes happen.
                  </p>
                </div>

                <div className="p-5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h4 className="font-semibold text-purple-300 mb-3">What this means for police:</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5" />
                      <span>Quick response after a crime can prevent more crimes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5" />
                      <span>Areas with recent crimes need extra attention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5" />
                      <span>Crime "hotspots" can move around the city</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionAnchor>

      {/* Results Section - ID: results-section */}
      <SectionAnchor id="results-section" className="py-20 container mx-auto px-6 relative z-10 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Real Results from Real Data</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Tested with 5 years of Portland police data. These aren't simulations - they're actual predictions checked against real crimes.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto space-y-16">
          {/* PEI Results */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <TrendingUp className="w-10 h-10 text-green-400" />
                <div>
                  <h3 className="text-2xl font-bold">Prediction Efficiency Index (PEI)</h3>
                  <p className="text-white/70">How much crime we "capture" with our predictions (higher is better)</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-green-800/50 bg-gradient-to-br from-black to-gray-900 p-8 min-h-[400px] flex items-center justify-center">
                    <img
                      src={peiImg}
                      alt="Prediction Efficiency Index Results Chart"
                      className="w-full h-full object-contain max-h-[350px]"
                    />
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-sm text-white/60">
                      <span className="text-green-300 font-semibold">PEI Results: </span>
                      Shows prediction efficiency for different crime types over 1-3 months
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-green-300 mb-4">Understanding PEI:</h4>
                    <p className="text-white/70 text-lg">
                      PEI measures how much crime we "capture" with our predictions.
                      <br /><br />
                      <span className="text-green-400 font-semibold text-xl">74.9% PEI for property crimes</span> means we correctly
                      predict nearly 3 out of every 4 property crimes.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {crimeTypes.map((crime, index) => (
                      <div key={index} className="p-5 bg-gradient-to-br from-gray-800/50 to-black rounded-xl border border-gray-700 text-center hover:border-green-500/30 transition-all duration-300">
                        <div className="text-3xl font-bold text-white mb-2">{crime.pei}%</div>
                        <div className="text-lg font-semibold text-gray-300 mb-2">{crime.name}</div>
                        <div className="text-sm text-gray-400">{crime.description}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 bg-gradient-to-br from-blue-900/10 to-black rounded-xl border border-blue-800/20">
                    <h4 className="font-semibold text-blue-300 mb-3">Context for Police Departments:</h4>
                    <p className="text-white/70 text-sm">
                      Police typically patrol random areas or based on experience. Our method is
                      <span className="text-green-400 font-semibold"> 2-3 times more efficient</span> than random patrols,
                      meaning officers spend more time in areas where crimes are actually likely to occur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Accuracy Results */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <Target className="w-10 h-10 text-blue-400" />
                <div>
                  <h3 className="text-2xl font-bold">Hotspot Accuracy</h3>
                  <p className="text-white/70">Percentage of predicted hotspots that actually have crime</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-blue-300 mb-4">Portland Results:</h4>
                    <p className="text-white/70 text-lg">
                      We test predictions for 1, 2, and 3 months ahead. As you'd expect,
                      accuracy goes down the further we try to predict, but even at 3 months,
                      we're still better than random chance.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="p-5 bg-gradient-to-br from-blue-900/10 to-black rounded-xl border border-blue-800/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-lg font-semibold">1 Month Prediction:</span>
                        <span className="text-green-400 font-bold text-xl">61% accurate</span>
                      </div>
                      <p className="text-white/60 text-sm">
                        For property crimes, 61% of our predicted hotspots actually have crimes next month
                      </p>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-purple-900/10 to-black rounded-xl border border-purple-800/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-lg font-semibold">Best Case Scenario:</span>
                        <span className="text-green-400 font-bold text-xl">76.2% accurate</span>
                      </div>
                      <p className="text-white/60 text-sm">
                        For 1-month property crime predictions, we reach 76.2% accuracy - that's 3 out of 4 hotspots being correct
                      </p>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-green-900/10 to-black rounded-xl border border-green-800/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-lg font-semibold">Sarasota MLP Target:</span>
                        <span className="text-green-400 font-bold text-xl">89%+ accurate</span>
                      </div>
                      <p className="text-white/60 text-sm">
                        Our MLP neural network research aims to push accuracy beyond 89% with Sarasota data
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-blue-800/50 bg-gradient-to-br from-black to-gray-900 p-8 min-h-[400px] flex items-center justify-center">
                    <img
                      src={accuracyImg}
                      alt="Hotspot Accuracy Results Chart"
                      className="w-full h-full object-contain max-h-[350px]"
                    />
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-white/60">
                      <span className="text-blue-300 font-semibold">Accuracy Chart: </span>
                      Shows accuracy rates for different crime types over 1-3 months prediction horizons
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionAnchor>

      {/* Final Summary */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="relative p-8 rounded-2xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />

              {/* Content */}
              <div className="relative z-10">
                <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-6">From Portland to Sarasota: The Evolution of Crime Prediction</h3>

                <div className="space-y-4 text-left bg-gray-900/50 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/80">
                      <strong>Portland proved it works:</strong> 74.9% PEI with simple Excel-based Lee Algorithm
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/80">
                      <strong>No black boxes:</strong> Everything is transparent and explainable
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/80">
                      <strong>Real police data:</strong> Tested with 5+ years of actual crime records
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 bg-purple-200 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-white/80">
                      <strong>Sarasota MLP enhancement:</strong> Neural networks targeting 89%+ accuracy
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-blue-500/5 rounded-xl border border-blue-500/20">
                  <h4 className="text-xl font-bold text-white mb-3">The Research Journey Continues</h4>
                  <p className="text-white/70">
                    We started with Portland proving that simple math can predict crime. Now with Sarasota,
                    we're enhancing those predictions with AI while keeping the transparency that made the
                    Lee Algorithm so valuable to police departments.
                  </p>
                  <div className="mt-4 text-amber-300 font-semibold">
                    Simple math established the foundation. AI is building the future.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default OurWorkPage;
