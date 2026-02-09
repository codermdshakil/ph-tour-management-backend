import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHanlers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

// create division
const createDivision = async (payload: Partial<IDivision>) => {

  const isExistingDivision = await Division.findOne({ name: payload.name });

  const baseslug = payload.name?.toLowerCase().split(" ").join("-");
  let slug = `${baseslug}-division`;

  let counter = 0;

  while(await Division.exists({slug})){
    slug = `${slug}-${counter++}`;
  }


  if (isExistingDivision) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This Division name Already Exist!",
    );
  }
  payload.slug=slug;

  const division = await Division.create(payload);

  return division;
};

// get all divisions
const getAllDivisions = async () => {
  const divisions = await Division.find({});
  const totalDivisions = await Division.countDocuments();

  return {
    data:divisions,
    meta:{
      total:totalDivisions
    }
  }
}

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const isExist = await Division.findById(id);

  // check existence
  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Division not Found!");
  }

  // empty payload check
  if (!payload || Object.keys(payload).length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Nothing to update");
  }

  // check duplicate
  if (payload.name) {
    const isDuplicate = await Division.findOne({
      name: payload.name,
      _id: { $ne: id },
    });

    const baseslug = payload.name?.toLowerCase().split(" ").join("-");
      let slug = `${baseslug}-division`;
    
      let counter = 0;
    
      while (await Division.exists({ slug })) {
        slug = `${slug}-${counter++}`;
      }

      payload.slug = slug;
      
    if (isDuplicate) {
      throw new AppError(409, "Division already exists");
    }
  }

  const result = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteDivision = async (id: string) => {
  const division = await Division.findById(id);

  if (!division) {
    throw new AppError(StatusCodes.NOT_FOUND, "Division not found");
  }

  await Division.findByIdAndDelete(id);

  return null;
};

const getSingleDivision = async (slug:string) => {
  const division = await Division.findOne({ slug });
    return {
        data: division,
    }
}

export const DivisionService = {
  createDivision,
  getAllDivisions,
  updateDivision,
  deleteDivision,
  getSingleDivision
};
