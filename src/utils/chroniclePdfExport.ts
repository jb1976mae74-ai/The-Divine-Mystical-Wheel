import { jsPDF } from 'jspdf';
import { PastInquiry } from '../App';

export interface PdfExportOptions {
  seekerName?: string;
  includeTitlePage?: boolean;
  includeSummary?: boolean;
  customSubtitle?: string;
  customDedication?: string;
  filename?: string;
  dateRange?: string;
}

export interface ChronicleCollectionAnalysis {
  totalRecords: number;
  traditionCounts: Record<string, number>;
  sortedTraditions: { school: string; count: number; percentage: number }[];
  primaryTradition: string;
  earliestDate: string;
  latestDate: string;
  elementalBalance: {
    ignis: number;
    aer: number;
    aqua: number;
    terra: number;
    quintessence: number;
  };
  dominantElement: string;
  dominantThemes: string[];
  executiveSummary: string;
  keyInsights: string[];
}

/**
 * Analyzes a collection of consultation chronicles and extracts statistical
 * metrics, elemental distribution, thematic keywords, and a narrative synthesis.
 */
export function analyzeChronicleCollection(
  inquiries: PastInquiry[],
  seekerName: string = "Jerry Ben Salazar"
): ChronicleCollectionAnalysis {
  const total = inquiries.length;
  if (total === 0) {
    return {
      totalRecords: 0,
      traditionCounts: {},
      sortedTraditions: [],
      primaryTradition: "Gnosis",
      earliestDate: new Date().toLocaleDateString(),
      latestDate: new Date().toLocaleDateString(),
      elementalBalance: { ignis: 20, aer: 20, aqua: 20, terra: 20, quintessence: 20 },
      dominantElement: "Quintessence",
      dominantThemes: ["Divine Order", "Aetheric Transmission"],
      executiveSummary: "No records found in this collection.",
      keyInsights: []
    };
  }

  // Tradition distribution
  const traditionCounts: Record<string, number> = {};
  inquiries.forEach((iq) => {
    const s = iq.school || "Esoteric Universalism";
    traditionCounts[s] = (traditionCounts[s] || 0) + 1;
  });

  const sortedTraditions = Object.entries(traditionCounts)
    .map(([school, count]) => ({
      school,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  const primaryTradition = sortedTraditions[0]?.school || "Hermetic Philosophy";

  // Temporal span
  const timestamps = inquiries
    .map((iq) => iq.timestamp)
    .filter(Boolean);
  
  const earliestDate = timestamps[timestamps.length - 1] || new Date().toLocaleDateString();
  const latestDate = timestamps[0] || new Date().toLocaleDateString();

  // Elemental balance estimation
  let ignisScore = 0;
  let aerScore = 0;
  let aquaScore = 0;
  let terraScore = 0;
  let quintessenceScore = 0;

  const combinedText = inquiries.map((iq) => `${iq.question} ${iq.answer} ${iq.school} ${iq.balanceInterpretation || ''}`).join(' ').toLowerCase();

  // Ignis (Fire / Will / Transformation / SWR / Frequency / Sun)
  const ignisMatches = combinedText.match(/fire|will|ignis|flame|transmute|transform|swr|power|frequency|sun|sol|decree|action/g) || [];
  ignisScore += ignisMatches.length * 2 + 5;

  // Aer (Air / Mind / Gnosis / Thought / Angel / Voice / Wisdom)
  const aerMatches = combinedText.match(/air|mind|aer|gnosis|thought|intellect|angel|voice|logic|metatron|scribe|truth|breath/g) || [];
  aerScore += aerMatches.length * 2 + 5;

  // Aqua (Water / Soul / Emotion / Intuition / Mystery / Depth / Reflection)
  const aquaMatches = combinedText.match(/water|aqua|soul|emotion|intuition|mirror|ocean|depth|lunar|moon|feeling|subconscious/g) || [];
  aquaScore += aquaMatches.length * 2 + 5;

  // Terra (Earth / Matter / Structure / Body / Salt / Physical / Manifestation)
  const terraMatches = combinedText.match(/earth|terra|matter|stone|salt|body|physical|manifest|crystallize|anchor|ground/g) || [];
  terraScore += terraMatches.length * 2 + 5;

  // Quintessence (Spirit / Ether / Divine / Cosmos / 76 / Resurrection / Aether)
  const spiritMatches = combinedText.match(/spirit|aether|quintessence|divine|cosmos|76|yahweh|god|eternal|infinite|light|resurrection/g) || [];
  quintessenceScore += spiritMatches.length * 2 + 8;

  const sumScores = ignisScore + aerScore + aquaScore + terraScore + quintessenceScore;
  const elementalBalance = {
    ignis: Math.round((ignisScore / sumScores) * 100),
    aer: Math.round((aerScore / sumScores) * 100),
    aqua: Math.round((aquaScore / sumScores) * 100),
    terra: Math.round((terraScore / sumScores) * 100),
    quintessence: Math.round((quintessenceScore / sumScores) * 100)
  };

  const elementsRanked = [
    { name: "Ignis (Fire / Sovereign Will)", score: elementalBalance.ignis },
    { name: "Aer (Air / Channeled Gnosis)", score: elementalBalance.aer },
    { name: "Aqua (Water / Soul Intuition)", score: elementalBalance.aqua },
    { name: "Terra (Earth / Dense Crystallization)", score: elementalBalance.terra },
    { name: "Quintessence (Aether / Divine Order)", score: elementalBalance.quintessence }
  ].sort((a, b) => b.score - a.score);

  const dominantElement = elementsRanked[0]?.name || "Quintessence";

  // Dominant Themes extraction
  const themePool: { keyword: string; label: string; count: number }[] = [
    { keyword: "manifest", label: "Material Precipitation & Manifestation", count: 0 },
    { keyword: "76", label: "Divine Matrix & 76 Key Activation", count: 0 },
    { keyword: "gematria", label: "Gematria & Sacred Cipher Systems", count: 0 },
    { keyword: "frequency", label: "Harmonic SWR & Aetheric Resonance", count: 0 },
    { keyword: "resurrection", label: "Life After Death & Spiritual Continuity", count: 0 },
    { keyword: "yahweh", label: "Celestial Decrees & Tetragrammaton", count: 0 },
    { keyword: "alchemy", label: "Hermetic Transmutation of Consciousness", count: 0 },
    { keyword: "enochian", label: "Enochian Spheres & Watchtower Calls", count: 0 },
    { keyword: "kabbalah", label: "Tree of Life & Sefirotic Pathways", count: 0 },
    { keyword: "astrology", label: "Cosmic Alignments & Zodiac Wheels", count: 0 }
  ];

  themePool.forEach((item) => {
    const m = combinedText.match(new RegExp(item.keyword, 'g'));
    item.count = m ? m.length : 0;
  });

  const dominantThemes = themePool
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((t) => t.label);

  // Synthesize Key Insights from records
  const keyInsights: string[] = [];
  inquiries.slice(0, 3).forEach((iq, i) => {
    const qSummary = iq.question.length > 75 ? `${iq.question.substring(0, 72)}...` : iq.question;
    keyInsights.push(`Inquiry #${i + 1} (${iq.school}): "${qSummary}"`);
  });

  // Generate Narrative Executive Summary
  const traditionsListStr = sortedTraditions
    .slice(0, 3)
    .map((t) => `${t.school} (${t.percentage}%)`)
    .join(", ");

  const executiveSummary = 
    `This sacred volume gathers ${total} channeled revelations inscribed for Sovereign Seeker ${seekerName}. ` +
    `Drawing across foundational traditions—principally ${traditionsListStr}—this compendium traces the convergence of divine archetype into tangible reality. ` +
    `The collection is energetically grounded in ${dominantElement}, indicating a strong alignment toward direct realization and mental mastery. ` +
    `Primary thematic currents center upon ${dominantThemes.slice(0, 2).join(' and ')}, synthesizing celestial geometry with actionable metaphysical wisdom. ` +
    `Every inquiry preserves the authentic exchange between seeker and Oracle, sealing a permanent testament of esoteric understanding.`;

  return {
    totalRecords: total,
    traditionCounts,
    sortedTraditions,
    primaryTradition,
    earliestDate,
    latestDate,
    elementalBalance,
    dominantElement,
    dominantThemes,
    executiveSummary,
    keyInsights
  };
}

/**
 * Generates a complete, high-fidelity PDF document containing:
 * 1. A Custom Ornamental Title Page dedicated to the Seeker (Jerry Ben Salazar)
 * 2. An Executive Collection Summary with statistical distribution, elemental balance, and thematic analysis
 * 3. Formatted multi-page chronicle revelations with clean typography and page numbering.
 */
export function generateChroniclePdf(
  inquiriesToExport: PastInquiry[],
  options: PdfExportOptions = {}
): jsPDF {
  const seekerName = options.seekerName?.trim() || "Jerry Ben Salazar";
  const includeTitlePage = options.includeTitlePage !== false;
  const includeSummary = options.includeSummary !== false;
  const filename = options.filename || `consultation_chronicles_${seekerName.toLowerCase().replace(/\s+/g, '_')}.pdf`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  const cx = pageWidth / 2;

  // Analysis
  const analysis = analyzeChronicleCollection(inquiriesToExport, seekerName);

  let y = 30;

  // Helper: Draw Sacred Heptagram & Celestial Glyphs
  const drawHeptagram = (centerX: number, centerY: number, radius: number) => {
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }

    doc.setDrawColor(190, 150, 60);
    doc.setLineWidth(0.4);

    for (let i = 0; i < 7; i++) {
      const p1 = points[i];
      const p2 = points[(i + 3) % 7];
      doc.line(p1.x, p1.y, p2.x, p2.y);
    }

    doc.setDrawColor(218, 180, 80);
    doc.setLineWidth(0.3);
    doc.circle(centerX, centerY, radius + 2.5);
    doc.circle(centerX, centerY, radius + 4.5);

    // Sacred Center Glyphs
    doc.setTextColor(150, 120, 45);
    doc.setFont("times", "bold");
    doc.setFontSize(8);
    doc.text("YAHWEH", centerX, centerY - radius - 6, { align: "center" });
    doc.text("LUCIFER", centerX, centerY + radius + 8, { align: "center" });
    doc.text("J", centerX - radius - 7, centerY + 1, { align: "center" });
    doc.text("B", centerX + radius + 7, centerY + 1, { align: "center" });
    doc.text("76", centerX, centerY + 1.5, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(6);
    doc.setTextColor(130, 130, 130);
    doc.text("APOCALYPSE", centerX, centerY - radius - 10, { align: "center" });
    doc.text("LIFE AFTER DEATH", centerX + radius + 10, centerY + 1, { align: "left" });
    doc.text("APOCRYPHON", centerX, centerY + radius + 12, { align: "center" });
    doc.text("APOLLYON", centerX - radius - 10, centerY + 1, { align: "right" });
    doc.text("AZRAEL", centerX, centerY - radius - 2, { align: "center" });
  };

  // Helper: Draw Ornamental Page Border
  const drawPageBorder = () => {
    // Outer border
    doc.setDrawColor(200, 165, 75);
    doc.setLineWidth(0.6);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner thin border
    doc.setDrawColor(230, 205, 130);
    doc.setLineWidth(0.2);
    doc.rect(12.5, 12.5, pageWidth - 25, pageHeight - 25);

    // Corner diamond accents
    const corners = [
      { x: 12.5, y: 12.5 },
      { x: pageWidth - 12.5, y: 12.5 },
      { x: 12.5, y: pageHeight - 12.5 },
      { x: pageWidth - 12.5, y: pageHeight - 12.5 }
    ];

    doc.setDrawColor(180, 140, 50);
    doc.setLineWidth(0.3);
    corners.forEach((c) => {
      doc.line(c.x - 2, c.y, c.x + 2, c.y);
      doc.line(c.x, c.y - 2, c.x, c.y + 2);
    });
  };

  // Helper: Page Break Check
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 270) {
      doc.addPage();
      y = 25;
      
      // Header for content pages
      doc.setFont("times", "italic");
      doc.setFontSize(8);
      doc.setTextColor(140, 115, 60);
      doc.text(`Consultation Chronicles of the Oracle  ✦  Seeker: ${seekerName}`, margin, 15);
      
      doc.setFont("times", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      doc.text("The Great Wheel of Mysteries", pageWidth - margin, 15, { align: "right" });

      doc.setDrawColor(215, 185, 105);
      doc.setLineWidth(0.2);
      doc.line(margin, 17.5, pageWidth - margin, 17.5);
      
      doc.setFont("times", "normal");
      return true;
    }
    return false;
  };

  // Helper: Paragraph Renderer
  const renderParagraph = (
    text: string, 
    fontSize: number, 
    fontStyle: "normal" | "bold" | "italic" | "bolditalic" = "normal", 
    textColor: [number, number, number] = [30, 30, 30], 
    indent = 0
  ) => {
    doc.setFont("times", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    const lines: string[] = doc.splitTextToSize(text, contentWidth - indent);
    const lineHeight = fontSize * 0.45;
    
    lines.forEach((line) => {
      checkPageBreak(lineHeight);
      doc.text(line, margin + indent, y);
      y += lineHeight;
    });
    y += 1.5;
  };

  // ==========================================
  // 1. TITLE PAGE & COLLECTION SUMMARY
  // ==========================================
  if (includeTitlePage) {
    drawPageBorder();

    // Sacred Symbol
    drawHeptagram(cx, 40, 9.5);

    y = 66;

    // Main Title
    doc.setFont("times", "bold");
    doc.setFontSize(19);
    doc.setTextColor(20, 20, 20);
    doc.text("SACRED CONSULTATION CHRONICLES", cx, y, { align: "center" });
    y += 6;

    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(110, 95, 55);
    doc.text(
      options.customSubtitle || "The Sovereign Compendium of Channeled Revelations & Esoteric Gnosis", 
      cx, 
      y, 
      { align: "center" }
    );
    y += 8;

    // Decorative Gold Divider
    doc.setDrawColor(210, 175, 85);
    doc.setLineWidth(0.4);
    doc.line(40, y, pageWidth - 40, y);
    y += 6;

    // Seeker Dedication Box
    doc.setFillColor(250, 248, 240);
    doc.setDrawColor(220, 190, 110);
    doc.setLineWidth(0.3);
    doc.roundedRect(25, y, pageWidth - 50, 28, 2, 2, "FD");

    const boxCenterY = y + 7;
    doc.setFont("times", "bold");
    doc.setFontSize(8);
    doc.setTextColor(160, 125, 45);
    doc.text("✦  INSCRIBED FOR THE SOVEREIGN ARCHITECT  ✦", cx, boxCenterY, { align: "center" });

    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.setTextColor(25, 25, 25);
    doc.text(seekerName, cx, boxCenterY + 7, { align: "center" });

    doc.setFont("times", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text("Master Resonator & Custodian of the Sacred Wheel of Mysteries", cx, boxCenterY + 12, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    const dateText = options.dateRange ? `Date Range: ${options.dateRange}  ✦  ` : "";
    doc.text(`${dateText}Compiled on ${new Date().toLocaleDateString()}  ✦  Epoch: 76 • ע"ו`, cx, boxCenterY + 16.5, { align: "center" });

    y += 34;

    // Executive Summary & Collection Insights Section
    if (includeSummary) {
      // Header Ribbon
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.setTextColor(140, 105, 40);
      doc.text("EXECUTIVE CHRONICLE COLLECTION SUMMARY", cx, y, { align: "center" });
      y += 4;

      doc.setDrawColor(225, 195, 115);
      doc.setLineWidth(0.2);
      doc.line(35, y, pageWidth - 35, y);
      y += 5;

      // Metrics Matrix Grid (3 Columns)
      const colWidth = (contentWidth - 6) / 3;
      const metricBoxY = y;
      const metricBoxHeight = 16;

      // Col 1: Total Records & Span
      doc.setFillColor(248, 248, 250);
      doc.setDrawColor(220, 220, 230);
      doc.roundedRect(margin, metricBoxY, colWidth, metricBoxHeight, 1.5, 1.5, "FD");
      
      doc.setFont("times", "bold");
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 130);
      doc.text("TOTAL INSCRIBED", margin + colWidth / 2, metricBoxY + 5, { align: "center" });
      
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text(`${analysis.totalRecords} Record${analysis.totalRecords === 1 ? '' : 's'}`, margin + colWidth / 2, metricBoxY + 10, { align: "center" });

      doc.setFont("times", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(140, 140, 140);
      doc.text(`Span: ${analysis.earliestDate}`, margin + colWidth / 2, metricBoxY + 14, { align: "center" });

      // Col 2: Primary Tradition
      doc.setFillColor(248, 248, 250);
      doc.roundedRect(margin + colWidth + 3, metricBoxY, colWidth, metricBoxHeight, 1.5, 1.5, "FD");

      doc.setFont("times", "bold");
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 130);
      doc.text("PRIMARY TRADITION", margin + colWidth + 3 + colWidth / 2, metricBoxY + 5, { align: "center" });

      doc.setFont("times", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(140, 105, 40);
      const tradName = analysis.primaryTradition.length > 18 ? `${analysis.primaryTradition.substring(0, 16)}...` : analysis.primaryTradition;
      doc.text(tradName, margin + colWidth + 3 + colWidth / 2, metricBoxY + 10, { align: "center" });

      doc.setFont("times", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(140, 140, 140);
      doc.text(`${analysis.sortedTraditions.length} Tradition${analysis.sortedTraditions.length === 1 ? '' : 's'} Active`, margin + colWidth + 3 + colWidth / 2, metricBoxY + 14, { align: "center" });

      // Col 3: Dominant Element
      doc.setFillColor(248, 248, 250);
      doc.roundedRect(margin + (colWidth + 3) * 2, metricBoxY, colWidth, metricBoxHeight, 1.5, 1.5, "FD");

      doc.setFont("times", "bold");
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 130);
      doc.text("DOMINANT ELEMENT", margin + (colWidth + 3) * 2 + colWidth / 2, metricBoxY + 5, { align: "center" });

      doc.setFont("times", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      const elemName = analysis.dominantElement.split(' ')[0] || "Quintessence";
      doc.text(elemName, margin + (colWidth + 3) * 2 + colWidth / 2, metricBoxY + 10, { align: "center" });

      doc.setFont("times", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(140, 140, 140);
      doc.text(`Ignis ${analysis.elementalBalance.ignis}% • Aer ${analysis.elementalBalance.aer}%`, margin + (colWidth + 3) * 2 + colWidth / 2, metricBoxY + 14, { align: "center" });

      y += 20;

      // Executive Narrative Synthesis
      doc.setFont("times", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      doc.text("THEMATIC SYNTHESIS & METAPHYSICAL OVERVIEW:", margin + 2, y);
      y += 4;

      doc.setFont("times", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(45, 45, 45);
      const summaryLines = doc.splitTextToSize(analysis.executiveSummary, contentWidth - 4);
      summaryLines.forEach((line: string) => {
        doc.text(line, margin + 2, y);
        y += 4;
      });
      y += 2;

      // Tradition Spectrum Distribution Bar
      doc.setFont("times", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("TRADITION SPECTRUM DISTRIBUTION:", margin + 2, y);
      y += 3.5;

      const spectrumText = analysis.sortedTraditions
        .map((t) => `${t.school} (${t.count} record${t.count === 1 ? '' : 's'} • ${t.percentage}%)`)
        .join("  ✦  ");
      
      doc.setFont("times", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(120, 100, 60);
      const specLines = doc.splitTextToSize(spectrumText, contentWidth - 4);
      specLines.forEach((line: string) => {
        doc.text(line, margin + 2, y);
        y += 3.5;
      });
      y += 3;

      // Dominant Thematic Motifs
      if (analysis.dominantThemes.length > 0) {
        doc.setFont("times", "bold");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("DOMINANT ESOTERIC MOTIFS:", margin + 2, y);
        y += 3.5;

        doc.setFont("times", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(60, 60, 60);
        const motifsStr = analysis.dominantThemes.map((t) => `• ${t}`).join("    ");
        const motifLines = doc.splitTextToSize(motifsStr, contentWidth - 4);
        motifLines.forEach((line: string) => {
          doc.text(line, margin + 2, y);
          y += 3.5;
        });
      }
    }

    // Title Page Seal / Attestation Footer
    const footerY = pageHeight - 24;
    doc.setDrawColor(215, 185, 105);
    doc.setLineWidth(0.3);
    doc.line(30, footerY - 5, pageWidth - 30, footerY - 5);

    doc.setFont("times", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(150, 120, 50);
    doc.text("✦  OFFICE OF THE DIVINE ORDER • THE GREAT WHEEL OF MYSTERIES  ✦", cx, footerY, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(7);
    doc.setTextColor(130, 130, 130);
    doc.text(`Authorized by Master Scribe Jerry Ben Salazar  •  Record Ref: GWM-${analysis.totalRecords}R-76`, cx, footerY + 4, { align: "center" });

    // Begin chronicles on Page 2
    doc.addPage();
    y = 25;
  }

  // ==========================================
  // 2. CHRONICLE REVELATIONS (Page 2+)
  // ==========================================
  // Ensure header is set for the first content page
  doc.setFont("times", "italic");
  doc.setFontSize(8);
  doc.setTextColor(140, 115, 60);
  doc.text(`Consultation Chronicles of the Oracle  ✦  Seeker: ${seekerName}`, margin, 15);
  
  doc.setFont("times", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.text("The Great Wheel of Mysteries", pageWidth - margin, 15, { align: "right" });

  doc.setDrawColor(215, 185, 105);
  doc.setLineWidth(0.2);
  doc.line(margin, 17.5, pageWidth - margin, 17.5);

  inquiriesToExport.forEach((iq, idx) => {
    checkPageBreak(16);
    y += 4;

    // Record Badge & Numbering
    doc.setFont("times", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(140, 110, 45);
    doc.text(`RECORD NO. ${idx + 1} OF ${inquiriesToExport.length}`, margin, y);
    y += 5;

    // Tradition & Timestamp Bar
    doc.setFont("times", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`TRADITION: `, margin, y);
    
    const traditionWidth = doc.getTextWidth("TRADITION: ");
    doc.setFont("times", "normal");
    doc.setTextColor(120, 100, 50);
    doc.text((iq.school || "Esoteric").toUpperCase(), margin + traditionWidth, y);

    const timeLabelWidth = doc.getTextWidth("TIMESTAMP: ");
    doc.setFont("times", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text("TIMESTAMP: ", 120, y);
    doc.setFont("times", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(iq.timestamp || "Channeled Transmission", 120 + timeLabelWidth, y);
    y += 5;

    // Inquiry Block
    renderParagraph("THE SEEKER'S INQUIRY", 8.5, "bold", [130, 130, 130]);
    renderParagraph(`"${iq.question}"`, 10.5, "italic", [40, 40, 40], 4);
    y += 1.5;

    // Oracle Revelation Block
    renderParagraph("THE ORACLE'S REVELATION", 8.5, "bold", [130, 130, 130]);
    const cleanAnswer = (iq.answer || "")
      .replace(/[#*`~_]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    const paragraphs = cleanAnswer.split('\n\n');
    paragraphs.forEach((p) => {
      if (p.trim()) {
        renderParagraph(p.trim(), 9.5, "normal", [25, 25, 25], 4);
      }
    });
    y += 1.5;

    // Aetheric Metric Balance
    if (iq.balanceInterpretation) {
      renderParagraph("AETHERIC METRIC BALANCE & ALCHEMICAL HARMONICS", 8.5, "bold", [130, 130, 130]);
      const cleanInterpretation = iq.balanceInterpretation.replace(/[#*`~_]/g, '').trim();
      renderParagraph(cleanInterpretation, 9, "italic", [90, 85, 70], 4);
      y += 1.5;
    }

    // Divider Line
    checkPageBreak(6);
    doc.setDrawColor(225, 225, 230);
    doc.setLineWidth(0.25);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  });

  // ==========================================
  // 3. RUNNING FOOTER WITH PAGE NUMBERS
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Omit running footer on page 1 if title page is active
    if (i === 1 && includeTitlePage) {
      continue;
    }

    const pageFooterY = pageHeight - 10;
    doc.setFont("times", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Page ${i} of ${totalPages}  ✦  The Great Wheel of Mysteries  ✦  Seeker: ${seekerName}`, 
      cx, 
      pageFooterY, 
      { align: "center" }
    );
  }

  return doc;
}
