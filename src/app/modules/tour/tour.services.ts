import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHanlers/AppError";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });

  if (existingTour) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      "A tour with this title already exist!!",
    );
  }

  const baseslug = payload.title?.toLowerCase().split(" ").join("-");
  let slug = `${baseslug}-division`;

  let counter = 0;

  while (await Tour.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }

  payload.slug = slug;

  const tour = await Tour.create(payload);

  return tour;
};

const getAllTours = async () => {
  const tours = await Tour.find({});
  const totalTours = await Tour.countDocuments();

  return {
    data:tours,
    meta:{
      total:totalTours
    }
  }
}

const getSingleTour = async (id:string) => {
  const tour = await Tour.findById(id);
  if(!tour){
    throw new AppError(StatusCodes.BAD_REQUEST, "Tour not Found!")
  }
    return tour;
}

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Tour not Found!");
  }

  if (payload.title) {
    const baseslug = payload.title?.toLowerCase().split(" ").join("-");
    let slug = `${baseslug}-division`;

    let counter = 0;

    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    payload.slug = slug;
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTour;
};

const deleteTour = async (id: string) => {

  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    throw new AppError(StatusCodes.NOT_FOUND,"No tour found with that ID");
  }

  return null;
};

export const TourServices = {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
  getSingleTour
};
