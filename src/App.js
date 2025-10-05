import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import './App.css';

// ---- Helpers ----
const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatNamesWithAmpersand = (namesString) => {
  // Split by ampersand, trim each part, then join with double-spaced ampersand
  const ampersandChar = String.fromCharCode(38); // Creates '&' character
  return namesString.split(ampersandChar).map(part => part.trim()).join(`  ${ampersandChar}  `);
};

const Label = ({ children }) => (
  <label className="text-sm font-medium text-gray-700">{children}</label>
);

function WeddingInviteGenerator() {
  const [form, setForm] = useState({
    inviteeName: "Dear Guest",
    address: "",
    date: "2025-10-07",
    venue: "Syed Colony Habak Naseem Bagh Srinagar",
    hosts: "Mrs. & Mr. Ghulam Rasool Baba",
    couple: { groom: "Nadeem Baba", bride: "Bride Name" },
    program: [
      { 
        occasion: "Masnandnishini", 
        date: "Tuesday 07th Oct, 2025",
        time: "4:00 PM", 
        ladies: "", 
        gents: "",
        ladiesFullFamily: false,
        gentsFullFamily: false
      },
      { 
        occasion: "Walima", 
        date: "Wednesday 08th Oct, 2025",
        time: "2:00 PM", 
        ladies: "", 
        gents: "",
        ladiesFullFamily: false,
        gentsFullFamily: false
      },
    ],
    rsvp1: "9596808961",
    rsvp2: "8082514748",
    lunchNotes: "Lunch will be served first to gents at 2:00 PM sharp & to ladies thereafter",
    programNote: "as per the following programme (In Sha Allah)",
    bestComplimentsFrom: "All Nears And Dears",
    qrText: "Scan For Location",
    qrImage: null,
  });

  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef(null);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleQRUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        update('qrImage', event.target.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid image file for the QR code.');
    }
  };

  const safeGradient =
    "radial-gradient(circle at 10% 10%, rgba(255,228,196,0.35) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(255,228,196,0.35) 0%, transparent 40%)";

  const downloadPDF = async () => {
    try {
      if (!cardRef.current) {
        setShowCard(true);
        await new Promise((r) => setTimeout(r, 250));
      }

      const el = cardRef.current;
      if (!el) return;

      const orig = {
        overflow: el.style.overflow || "",
        height: el.style.height || "",
        boxShadow: el.style.boxShadow || "",
      };

      el.style.overflow = "visible";
      el.style.height = el.scrollHeight + "px";
      el.style.boxShadow = "0 0 0 6px rgba(192,154,46,0.12)";

      await new Promise((r) => requestAnimationFrame(r));

      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to maintain aspect ratio
      const canvasAspectRatio = canvas.width / canvas.height;
      const pageAspectRatio = pageWidth / pageHeight;
      
      let imgWidth, imgHeight, xOffset, yOffset;
      
      if (canvasAspectRatio > pageAspectRatio) {
        // Canvas is wider than page - fit to width
        imgWidth = pageWidth;
        imgHeight = pageWidth / canvasAspectRatio;
        xOffset = 0;
        yOffset = (pageHeight - imgHeight) / 2;
      } else {
        // Canvas is taller than page - fit to height
        imgHeight = pageHeight;
        imgWidth = pageHeight * canvasAspectRatio;
        xOffset = (pageWidth - imgWidth) / 2;
        yOffset = 0;
      }

      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
      pdf.save(`Invitation_${form.inviteeName.replace(/\s+/g, "_")}.pdf`);

      el.style.overflow = orig.overflow;
      el.style.height = orig.height;
      el.style.boxShadow = orig.boxShadow;
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF: " + (err?.message || err));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl bg-white/80 shadow-lg backdrop-blur p-5 md:p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Wedding Invitation Generator</h1>
          <p className="text-sm text-gray-600 mt-1">
            Fill the details and click <span className="font-medium">Preview</span> to view, or{' '}
            <span className="font-medium">Download PDF</span> to save the card (Portrait A4).
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Invitee Name</Label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.inviteeName}
                  onChange={(e) => update("inviteeName", e.target.value)}
                />
              </div>

              <div>
                <Label>Date</Label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Invitee Address (optional)</Label>
              <textarea
                className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                rows={2}
                placeholder="House / Street / City"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Hosts</Label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.hosts}
                  onChange={(e) => update("hosts", e.target.value)}
                />
              </div>
              <div>
                <Label>Venue</Label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.venue}
                  onChange={(e) => update("venue", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Groom Name</Label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.couple.groom}
                  onChange={(e) => update("couple", {...form.couple, groom: e.target.value})}
                />
              </div>
              <div>
                <Label>Bride Name</Label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.couple.bride}
                  onChange={(e) => update("couple", {...form.couple, bride: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>RSVP Number 1</Label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.rsvp1}
                  onChange={(e) => update("rsvp1", e.target.value)}
                />
              </div>
              <div>
                <Label>RSVP Number 2</Label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.rsvp2}
                  onChange={(e) => update("rsvp2", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Best compliments from</Label>
              <input
                className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Enter names"
                value={form.bestComplimentsFrom}
                onChange={(e) => update("bestComplimentsFrom", e.target.value)}
              />
            </div>


            <div>
              <Label>Lunch Notes</Label>
              <textarea
                className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                rows={2}
                value={form.lunchNotes}
                onChange={(e) => update("lunchNotes", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>QR Code Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  onChange={handleQRUpload}
                />
                {form.qrImage && (
                  <div className="mt-2">
                    <img 
                      src={form.qrImage} 
                      alt="QR Code Preview" 
                      className="w-16 h-16 object-cover border rounded"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label>QR Code Text</Label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g., Scan For Venue"
                  value={form.qrText}
                  onChange={(e) => update("qrText", e.target.value)}
                />
              </div>
            </div>

            {/* Program Details Section */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Program Details</h3>
              {form.program.map((prog, progIndex) => (
                <div key={progIndex} className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-700 mb-3">{prog.occasion}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <Label>Ladies</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`ladies-full-${progIndex}`}
                            checked={prog.ladiesFullFamily}
                            onChange={(e) => {
                              const newProgram = [...form.program];
                              newProgram[progIndex].ladiesFullFamily = e.target.checked;
                              if (e.target.checked) {
                                newProgram[progIndex].ladies = '';
                              }
                              update('program', newProgram);
                            }}
                            className="rounded"
                          />
                          <label htmlFor={`ladies-full-${progIndex}`} className="text-sm text-gray-600">
                            Full Family (shows dots)
                          </label>
                        </div>
                        {!prog.ladiesFullFamily && (
                          <input
                            className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Enter number or leave empty"
                            value={prog.ladies}
                            onChange={(e) => {
                              const newProgram = [...form.program];
                              newProgram[progIndex].ladies = e.target.value;
                              update('program', newProgram);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Gents</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`gents-full-${progIndex}`}
                            checked={prog.gentsFullFamily}
                            onChange={(e) => {
                              const newProgram = [...form.program];
                              newProgram[progIndex].gentsFullFamily = e.target.checked;
                              if (e.target.checked) {
                                newProgram[progIndex].gents = '';
                              }
                              update('program', newProgram);
                            }}
                            className="rounded"
                          />
                          <label htmlFor={`gents-full-${progIndex}`} className="text-sm text-gray-600">
                            Full Family (shows dots)
                          </label>
                        </div>
                        {!prog.gentsFullFamily && (
                          <input
                            className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Enter number or leave empty"
                            value={prog.gents}
                            onChange={(e) => {
                              const newProgram = [...form.program];
                              newProgram[progIndex].gents = e.target.value;
                              update('program', newProgram);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowCard(true)}
                className="rounded-2xl bg-amber-400 px-4 py-2 text-white font-medium shadow hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-200"
              >
                Preview
              </button>

              <button
                onClick={downloadPDF}
                className="rounded-2xl bg-amber-500 px-4 py-2 text-white font-medium shadow hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-200"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Card Preview */}
        <div className="flex items-start justify-center">
          <div className="w-full max-w-[500px]">
            <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
              <span>Preview</span>
            </div>

            {showCard && (
              <div
                ref={cardRef}
                style={{ backgroundImage: safeGradient }}
                className="relative w-full h-[700px] rounded-2xl bg-white shadow-xl overflow-hidden border-4 border-amber-400"
              >
                <CardContent form={form} />

                <div className="absolute bottom-4 left-0 right-0 text-center px-6">
                  <div className="p-3">
                    <div className="text-2xl text-amber-600 mb-2">***</div>
                    <div className="relative inline-block">
                      <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-400 rounded-lg px-4 py-3 shadow-lg">
                        <div className="text-xl font-black text-amber-900 invitee-text" style={{fontFamily: 'serif'}}>{form.inviteeName}</div>
                        {form.address && (
                          <div className="text-sm text-amber-700 whitespace-pre-line mt-1 invitee-text" style={{fontFamily: 'serif'}}>{form.address}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CardContent({ form }) {
  return (
    <div className="px-6 py-4 h-full">
        <div className="h-full rounded-xl border-2 border-amber-300 p-4">
        {/* Header Section */}
        <div className="text-center">
          <div className="text-sm tracking-wide text-gray-500 mb-2">In the name of Allah, the Most Gracious, the Most Merciful</div>
          <h2 className="text-lg font-semibold hosts-name">{form.hosts}</h2>
          <p className="text-xs text-gray-600 mt-1">
            request the honour of your presence at the marriage
          </p>
          <p className="text-xs text-gray-600">
            ceremony of their beloved son
          </p>
          <div className="mt-2 text-2xl font-semibold">
            <span className="hosts-name">{form.couple.groom}</span>
          </div>
        </div>

        {/* Venue Section */}
        <div className="mt-3 text-center text-gray-700">
          <div className="text-xs">at their residence</div>
          <div className="text-sm font-medium">{form.venue}</div>
          <div className="text-xs text-gray-500 mt-1">{form.programNote}</div>
        </div>

        {/* Program Table */}
        <div className="mt-3">
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="font-semibold text-gray-700">Occasion</div>
            <div className="font-semibold text-gray-700">Time</div>
            <div className="font-semibold text-gray-700">Ladies</div>
            <div className="font-semibold text-gray-700">Gents</div>
          </div>
          {form.program.map((prog, index) =>
            <div key={index} className="mt-2">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <div className="italic font-medium">{prog.occasion}</div>
                  <div className="text-gray-500">{prog.date}</div>
                </div>
                <div className="font-medium">{prog.time}</div>
                {(prog.ladiesFullFamily || prog.gentsFullFamily) ? (
                  <div className="col-span-2 text-left font-medium pl-8">
                    Full Family
                  </div>
                ) : (
                  <>
                    <div>
                      {prog.occasion === "With Baraat" ? (prog.ladies ? <span className="font-bold">{prog.ladies}</span> : '') : (prog.ladies ? <span className="font-bold">{prog.ladies}</span> : '........')}
                    </div>
                    <div>
                      {prog.gents ? <span className="font-bold">{prog.gents}</span> : '........'}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Lunch Notes */}
        <div className="mt-3 text-xs text-gray-600">
          {form.lunchNotes}
        </div>

        {/* Bottom Section with RSVP and Best Compliments */}
        <div className="mt-4 flex items-end justify-between text-xs">
          {/* RSVP Section */}
          <div>
            <div className="font-semibold mb-1">RSVP</div>
            <div className="font-bold">{form.rsvp1}</div>
            <div className="font-bold">{form.rsvp2}</div>
          </div>

          {/* QR Code Section */}
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center mb-1 overflow-hidden mx-auto">
              {form.qrImage ? (
                <img 
                  src={form.qrImage} 
                  alt="QR Code" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs text-gray-400">QR</div>
              )}
            </div>
            <div className="text-xs text-gray-600">{form.qrText}</div>
          </div>

          {/* Best Compliments Section */}
          <div className="text-left">
            <div className="text-gray-600 mb-1">Best compliments from</div>
            <div className="font-semibold">{formatNamesWithAmpersand(form.bestComplimentsFrom)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

if (typeof window !== "undefined") {
  console.assert(
    typeof formatDate === "function" && formatDate("2025-08-21").includes("2025"),
    "formatDate should return a readable date containing the year"
  );

  console.assert(typeof safeGradient === "string", "safeGradient should be a string");
}

export default WeddingInviteGenerator;
