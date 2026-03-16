import { isValidObjectId } from "mongoose";

const mongoIdValidate = (id?:string | undefined)=>{
     return id && typeof id === 'string' &&  isValidObjectId(id);
}
export default mongoIdValidate;