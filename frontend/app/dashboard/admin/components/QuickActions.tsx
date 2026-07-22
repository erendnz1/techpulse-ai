"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  RefreshCcw,
  Brain,
  Trash2,
  FileText,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface Props {
  onFetch: () => Promise<void> | void;
}

export default function QuickActions({
  onFetch,
}: Props) {

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);


  async function handleFetch() {
    try {
      setLoading(true);
      await onFetch();
    } finally {
      setLoading(false);
    }
  }


  async function handleReanalyze() {
    const token = localStorage.getItem("access_token");

    try {

      setAiLoading(true);

      const loadingToast = toast.loading(
        "Running AI analysis..."
      );


      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/reanalyze`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!res.ok) throw new Error();


      const data = await res.json();


      toast.dismiss(loadingToast);

      toast.success(
        data.message ?? "AI analysis completed."
      );


    } catch {

      toast.error(
        "AI analysis failed."
      );

    } finally {

      setAiLoading(false);

    }
  }



  async function handleCleanup() {
    const token = localStorage.getItem("access_token");

    try {

      setCleanupLoading(true);

      const loadingToast =
        toast.loading("Cleaning database...");


      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/cleanup`,
        {
          method: "DELETE",
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }
      );


      if (!res.ok) throw new Error();


      const data = await res.json();


      toast.dismiss(loadingToast);

      toast.success(
        data.message ?? "Database cleaned successfully."
      );


    } catch {

      toast.error(
        "Cleanup failed."
      );

    } finally {

      setCleanupLoading(false);

    }
  }



  async function handleGenerateReport() {

    const token =
      localStorage.getItem("access_token");


    try {

      setReportLoading(true);


      const loadingToast =
        toast.loading("Generating PDF report...");


      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/report`,
        {
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }
      );


      if (!res.ok) throw new Error();


      const blob = await res.blob();


      const url =
        window.URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      link.href=url;
      link.download="TechPulseAI_Report.pdf";


      document.body.appendChild(link);

      link.click();

      link.remove();


      window.URL.revokeObjectURL(url);


      toast.dismiss(loadingToast);

      toast.success(
        "Report downloaded successfully."
      );


    } catch {

      toast.error(
        "Failed to generate report."
      );

    } finally {

      setReportLoading(false);

    }
  }



  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-700
        bg-slate-800/60
        p-4
        sm:p-5
        backdrop-blur-xl
      "
    >

      <div
        className="
          mb-5
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <div>

          <h2 className="text-lg font-bold text-white">
            Quick Actions
          </h2>


          <p className="mt-1 text-sm text-slate-400">
            Common administrative tasks
          </p>

        </div>


        <Sparkles
          size={18}
          className="shrink-0 text-indigo-400"
        />

      </div>



      <div className="space-y-3">

        <ActionButton
          icon={<RefreshCcw size={16}/>}
          text={
            loading
              ? "Fetching News..."
              : "Fetch Latest News"
          }
          onClick={handleFetch}
          loading={loading}
        />


        <ActionButton
          icon={<Brain size={16}/>}
          text={
            aiLoading
              ? "Running AI..."
              : "Run AI Analysis"
          }
          onClick={handleReanalyze}
          loading={aiLoading}
        />


        <ActionButton
          icon={<Trash2 size={16}/>}
          text={
            cleanupLoading
              ? "Cleaning..."
              : "Cleanup Database"
          }
          onClick={handleCleanup}
          loading={cleanupLoading}
        />


        <ActionButton
          icon={<FileText size={16}/>}
          text={
            reportLoading
              ? "Generating Report..."
              : "Generate PDF Report"
          }
          onClick={handleGenerateReport}
          loading={reportLoading}
        />

      </div>

    </div>

  );
}



function ActionButton({
  icon,
  text,
  onClick,
  disabled=false,
  loading=false,
}:{
  icon:React.ReactNode;
  text:string;
  onClick?:()=>void;
  disabled?:boolean;
  loading?:boolean;
}) {


  return (

    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        flex
        min-h-14
        w-full
        items-center
        justify-between
        rounded-xl
        border
        px-4
        py-3
        transition-all
        duration-200

        ${
          disabled
          ? "cursor-not-allowed border-slate-700 bg-slate-900/20 opacity-60"

          : loading
          ? "border-indigo-500 bg-slate-800/70 opacity-80"

          : "border-slate-700 bg-slate-900/40 hover:-translate-y-0.5 hover:border-indigo-500 hover:bg-slate-800"
        }
      `}
    >


      <div className="flex min-w-0 items-center gap-3">


        <div
          className="
            shrink-0
            rounded-lg
            bg-slate-800
            p-2
            text-indigo-400
          "
        >
          {icon}
        </div>


        <span className="truncate text-sm text-slate-300">
          {text}
        </span>


      </div>



      <ChevronRight
        size={16}
        className="shrink-0 text-slate-400"
      />


    </button>

  );
}