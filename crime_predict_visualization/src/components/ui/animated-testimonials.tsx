"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { FileText, Download, ExternalLink } from "lucide-react";

type ResearchPaper = {
  title: string;
  authors: string;
  journal: string;
  year: number;
  description: string;
  link: string;
  type: "PDF" | "Conference" | "Journal";
  citation: string;
};

export const AnimatedTestimonials = ({
  papers,
  autoplay = false,
  className,
}: {
  papers: ResearchPaper[];
  autoplay?: boolean;
  className?: string;
}) => {
  // ... existing component code (keep all the code from the previous version)
};

// ADD THIS DEMO COMPONENT AT THE BOTTOM OF THE SAME FILE
export function AnimatedTestimonialsDemo() {
  const researchPapers = [
    {
      title: "A Theory-Driven Algorithm for Real-Time Crime Hot Spot Forecasting",
      authors: "YongJei Lee, SooHyun O, John E. Eck",
      journal: "Police Quarterly",
      year: 2020,
      description: "We operationalize population heterogeneity and state dependence theories to forecast crime hot spots in Portland and Cincinnati. Our Excel-based algorithm demonstrates high efficiency (PEI: 85-92%) and transparency.",
      link: "#",
      type: "Journal" as const,
      citation: "Lee, Y., O, S., & Eck, J. E. (2020). A Theory-Driven Algorithm for Real-Time Crime Hot Spot Forecasting. Police Quarterly, 23(2), 174-201."
    },
    {
      title: "MLP-based Crime Forecasting with Spatiotemporal Features",
      authors: "Research Team",
      journal: "IEEE Conference on Predictive Analytics",
      year: 2023,
      description: "Multi-layer perceptron model incorporating 12-month temporal lags and 8 spatial neighbors for crime prediction. Achieves competitive PEI scores while maintaining interpretability.",
      link: "#",
      type: "Conference" as const,
      citation: "Research Team (2023). MLP-based Crime Forecasting with Spatiotemporal Features. Proceedings of IEEE Conference on Predictive Analytics."
    },
    {
      title: "Comparative Analysis of Crime Forecasting Algorithms",
      authors: "Research Team",
      journal: "Journal of Quantitative Criminology",
      year: 2022,
      description: "Systematic comparison of Lee Algorithm, MLP models, and KDE approaches across multiple datasets. Analysis of efficiency-accuracy tradeoffs in practical policing contexts.",
      link: "#",
      type: "Journal" as const,
      citation: "Research Team (2022). Comparative Analysis of Crime Forecasting Algorithms. Journal of Quantitative Criminology."
    },
    {
      title: "Real-Time Crime Forecasting Challenge Results",
      authors: "NIJ Competition Team",
      journal: "National Institute of Justice Report",
      year: 2019,
      description: "Results from the NIJ Real-Time Crime Forecasting Challenge. Our theory-driven approach achieved top rankings in multiple crime type categories.",
      link: "#",
      type: "PDF" as const,
      citation: "NIJ Competition Team (2019). Real-Time Crime Forecasting Challenge Results. National Institute of Justice Technical Report."
    },
    {
      title: "Spatial Grid Systems for Crime Analysis",
      authors: "Research Team",
      journal: "International Journal of Geographical Information Science",
      year: 2021,
      description: "Evaluation of 250m vs 500m grid systems for crime forecasting in Portland and Sarasota. Analysis of grid size impact on prediction accuracy and computational efficiency.",
      link: "#",
      type: "Journal" as const,
      citation: "Research Team (2021). Spatial Grid Systems for Crime Analysis. International Journal of Geographical Information Science."
    }
  ];

  return <AnimatedTestimonials papers={researchPapers} autoplay={true} />;
}
