import { Send, XIcon } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { branchName, Sites } from '../../assets';
import ReactQuill from 'react-quill-new';
import "react-quill-new/dist/quill.snow.css";
import Loading from '../Loading';


const ApplyComplaint = ({onClose,onSuccess,open}) => {

const [loading,setLoading]=useState(false)
const [description,setDescription]=useState("");
const [fileSize,setFileSize]=useState(null);
const [previewImages,setPreviewImages]=useState(null);



const uploadImage=async()=>{



  
}
const fileInputRef=useRef(null)

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    console.log({
      description,
      fileSize

    });

    // after submit success
    onSuccess(); 
    onClose();

  } catch(error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};


const handleFileSize = (e) => {

  const selectedFiles = Array.from(e.target.files);

  const maxSize = 2 * 1024 * 1024;

  const validFiles = [];

  for (let file of selectedFiles) {

    if(file.size > maxSize){
      alert(`${file.name} is more than 2MB`);
      continue;
    }

    validFiles.push(file);
  }


  setFileSize(validFiles);


  const imagePreviews = validFiles
    .filter(file => file.type.startsWith("image/"))
    .map(file => URL.createObjectURL(file));


  setPreviewImages(imagePreviews);

};


return (
<>
<div 
className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'
onClick={onClose}
>

<div 
className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8"
onClick={(e)=>e.stopPropagation()}
>


<form onSubmit={handleSubmit} className='p-6 space-y-5'>


<label>Branch Name</label>
<select required className="border p-2 w-full rounded">
<option value="">Select Branch</option>

{branchName.map((branch)=>(
<option key={branch} value={branch}>
{branch}
</option>
))}

</select>

<label>Site Name</label>
<select required className="border p-2 w-full rounded">
<option value="">Select Site</option>

{Sites.map((sites)=>(
<option key={sites} value={sites}>
{sites}
</option>
))}

</select>



<label>Assets Name</label>

<input 
type='text'
name="assetsName"
required
placeholder='Enter the Assets Name'
className="border p-2 w-full rounded"
/>
<label>Date of Complaint</label>
<input type='date' name='date' required placeholder="Enter Complaint Date" className="border p-2 w-full rounded"/>

<label>Description of Complaint</label>

<ReactQuill
theme="snow"
value={description}
onChange={setDescription}
placeholder="Write your complaint details here..."
className="bg-white"
/>



<label>Upload checklist</label>

<input
ref={fileInputRef}
type="file"
name="checklist"
accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
onChange={handleFileSize }
multiple

/>

{previewImages && (

<div className="flex gap-3 mt-3 flex-wrap">

{
previewImages.map((img,index)=>(

<div 
key={index}
className="relative w-24 h-24"
>

<img
src={img}
alt="preview"
className="w-24 h-24 object-cover rounded-lg border shadow"
/>


<button
type="button"
onClick={()=>{

const updatedImages = previewImages.filter(
(_,i)=>i !== index
);

setPreviewImages(updatedImages);

}}
className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
>
×
</button>


</div>

))
}

</div>

)}
<div className="flex gap-3">

<button 
type="submit"
className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
>
  {loading ? (
    "Submitting..."
  ) : (
    <>
      <Send className="w-4 h-4" />
      Submit
    </>
  )}
</button>


<button 
type="button"
onClick={onClose}
className="bg-white text-black border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100"
>
  Cancel
</button>

</div>

</form>


</div>
</div>

</>
)

}

export default ApplyComplaint;