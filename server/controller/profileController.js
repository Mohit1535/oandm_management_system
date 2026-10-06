import Employee from "../models/Employee.js"
import User from "../models/User.js"
//get Profile
export const getProfile = async (req, res) => {
  try {
    console.log("Session:", req.session);

    const session = req.session;

    const employee = await Employee.findOne({
      userId: session.userId,
    });

    console.log("Employee:", employee);

    if (!employee) {
      return res.json({
        firstName: "ADMIN",
        lastName: "",
        email: session.email,
      });
    }

    return res.json(employee);
  } catch (error) {
    console.error("PROFILE ERROR:", error);   // <-- add this

    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};

//update profile
export const updateProfile=async(req,res)=>{
    try{

const session=req.session
const employee=await Employee.findOne({userId:session.userId})
if(!employee) return res.status(404).json({error:"Employee not found"})

    if(employee.isDeleted){
        return res.status(403).json({error:"Your account is deactivated. You cannot update your profile"})
    }
await Employee.findByIdAndUpdate(employee._id,{
bio:req.body.bio
})
return res.json({success:true})


}
catch(error){
    return res.status(500).json({error:"Operation failed"})
}

}

