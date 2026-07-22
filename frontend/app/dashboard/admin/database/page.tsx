"use client";

import { useEffect, useState } from "react";
import {
  Database,
  Trash2,
  Server,
  Cpu,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function DatabaseManagementPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [stats, setStats] = useState({
    total_news: 0,
  });

  const [systemStatus, setSystemStatus] = useState({
    backend: "",
    database: "",
    scheduler: "",
    ai_service: "",
  });


  useEffect(() => {
    fetchStats();
    fetchSystemStatus();
  }, []);


  async function fetchStats() {
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      if(!res.ok) return;

      const data = await res.json();

      setStats({
        total_news:data.total_news
      });

    } catch(error){
      console.error(error);
    }
  }


  async function fetchSystemStatus(){

    const token = localStorage.getItem("access_token");

    try{

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/system-status`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      if(!res.ok) return;


      setSystemStatus(await res.json());


    }catch(error){
      console.error(error);
    }

  }



  async function handleCleanup(){

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("access_token");


    try{

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/cleanup`,
        {
          method:"DELETE",
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      const data = await res.json();

      setMessage(
        data.message ?? "Cleanup completed."
      );


      fetchStats();


    }catch(error){

      console.error(error);
      setMessage("Cleanup failed.");

    }


    setLoading(false);

  }



  return (

<div className="space-y-8 px-4 py-6 sm:px-6 lg:px-10">


{/* Header */}

<div>

<h1 className="flex items-center gap-3 text-3xl font-bold text-white">

<Database className="text-cyan-400"/>

Database Management

</h1>


<p className="mt-2 text-gray-400">
Manage database cleanup and system services.
</p>


</div>




{/* Stats */}


<div className="grid gap-5 sm:grid-cols-2">


<div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-6 backdrop-blur-xl transition hover:-translate-y-1">

<div className="flex justify-between">

<p className="text-sm text-gray-400">
Current News
</p>


<Database className="text-cyan-400"/>

</div>


<h2 className="mt-3 text-4xl font-bold text-white">
{stats.total_news}
</h2>


<p className="mt-1 text-xs text-gray-500">
Stored articles
</p>


</div>



<div className="rounded-2xl border border-green-500/20 bg-slate-900/60 p-6 backdrop-blur-xl transition hover:-translate-y-1">

<div className="flex justify-between">

<p className="text-sm text-gray-400">
Retention Period
</p>


<Clock className="text-green-400"/>

</div>


<h2 className="mt-3 text-4xl font-bold text-white">
30 Days
</h2>


<p className="mt-1 text-xs text-gray-500">
Automatic cleanup policy
</p>


</div>


</div>





{/* Cleanup */}


<div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">


<h2 className="text-xl font-bold text-white">
Automatic Cleanup
</h2>


<p className="mt-3 text-gray-400">

News older than
<strong className="text-white"> 30 days </strong>

are automatically deleted every day at

<strong className="text-white"> 03:00</strong>.

</p>



<div className="mt-5 flex gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">

<AlertTriangle size={20}/>

<span>
Old news and notifications will be permanently deleted.
This action cannot be undone.
</span>


</div>



{message && (

<div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">

{message}

</div>

)}



<button

onClick={()=>setShowConfirm(true)}

disabled={loading}

className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"

>


<Trash2 size={18}/>


{
loading
?
"Cleaning..."
:
"Run Cleanup Now"
}


</button>



</div>





{/* System Status */}


<div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">


<h2 className="flex items-center gap-2 text-xl font-bold text-white">

<Server className="text-blue-400"/>

System Status

</h2>



<div className="mt-6 grid gap-4 sm:grid-cols-2">


{
Object.entries(systemStatus).map(([key,value])=>(

<div
key={key}
className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
>


<span className="capitalize text-gray-300">
{key.replace("_"," ")}
</span>


<span className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">

<CheckCircle size={15}/>

{value || "Unknown"}

</span>


</div>

))
}



</div>

</div>







{/* Confirm Modal */}


{
showConfirm && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">


<div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">


<h2 className="text-xl font-bold text-white">
Confirm Cleanup
</h2>



<p className="mt-4 text-gray-400">

This will permanently delete news older than

<strong className="text-white">
{" "}30 days
</strong>.

</p>


<p className="mt-3 text-sm text-red-400">
This action cannot be undone.
</p>



<div className="mt-8 flex justify-end gap-3">


<button

onClick={()=>setShowConfirm(false)}

className="rounded-xl border border-white/10 px-4 py-2 text-gray-300 hover:bg-white/10"

>
Cancel
</button>



<button

onClick={async()=>{

setShowConfirm(false);

await handleCleanup();

}}

className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"

>

Delete

</button>



</div>


</div>


</div>

)

}


</div>

);

}