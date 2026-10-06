import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../component/Loading';
import { dummyComplaintData } from '../assets';
import { CheckCircleIcon, PlusIcon, XCircleIcon } from 'lucide-react';
import ApplyComplaint from '../component/Complaint/ApplyComplaint.jsx'
import ComplaintHistory from '../component/Complaint/ComplaintHistory.jsx'

const Complaint = () => {

  const [complaint,setComplaint]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showComplaintModel,setShowComplaintModel]=useState(false);

  const isAdmin=false;


  const fetchComplaint=useCallback(async()=>{
    setComplaint(dummyComplaintData);

    setTimeout(()=>{
      setLoading(false)
    },1000)

  },[])



  useEffect(()=>{
    fetchComplaint()
  },[fetchComplaint])


  if(loading) return <Loading/>


  const solvedComplaints = complaint.filter(
    (item)=> item.status === "SOLVED"
  ).length;


  const unsolvedComplaints = complaint.filter(
    (item)=> item.status === "UNSOLVED"
  ).length;



  return (

<>
<div className="animate-fade-in">


<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

<div>

<h1 className='page-title'>
Complaints Management
</h1>

<p className='page-subtitle'>
{isAdmin ? "Manage Complaint Applications" : "Your complaint history"}
</p>

</div>



{!isAdmin && (

<button
className='gap-2 w-full sm:w-auto btn-primary flex items-center'
onClick={()=>setShowComplaintModel(true)}
>

<PlusIcon className='w-4 h-4'/>

Apply for Complaint

</button>

)}

</div>



{
showComplaintModel && (

<ApplyComplaint
open={showComplaintModel}
onClose={()=>setShowComplaintModel(false)}
onSuccess={fetchComplaint}
/>

)

}



<ComplaintHistory
complaint={complaint}
onUpdate={fetchComplaint}
isAdmin={isAdmin}
/>



</div>

</>

  )
}

export default Complaint