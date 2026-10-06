import mongoose from "mongoose";

const branchSchema=new mongoose.Schema({
    branchName:{type:String,required:"true"}
})
const Branches = mongoose.models.Branches || mongoose.model("Branches", branchSchema);
export default Branches;
