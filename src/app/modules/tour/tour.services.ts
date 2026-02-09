import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHanlers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

// --------  TouType routes start here --------
const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      "This name TourType already exist!!",
    );
  }

  const tourType = await TourType.create(payload);

  return tourType;
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const existingTourType = await TourType.findById(id);

  if (!existingTourType) {
    throw new AppError(StatusCodes.BAD_REQUEST, "TourType not Found!");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTourType;
};

const getAllTourType = async () => {
  const toursTypes = await TourType.find({});
  const totalTourTypes = await TourType.countDocuments();

  return {
    data: toursTypes,
    meta: {
      total: totalTourTypes,
    },
  };
};

const deleteTourType = async (id: string) => {
  const tour = await TourType.findByIdAndDelete(id);

  if (!tour) {
    throw new AppError(StatusCodes.NOT_FOUND, "No tourType found with that ID");
  }

  return null;
};




const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });

  if (existingTour) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      "A tour with this title already exist!!",
    );
  }


  const tour = await Tour.create(payload);

  return tour;
};

const getAllTours = async () => {
  const tours = await Tour.find({});
  const totalTours = await Tour.countDocuments();

  return {
    data: tours,
    meta: {
      total: totalTours,
    },
  };
};

const getSingleTour = async (id: string) => {
  const tour = await Tour.findById(id);
  if (!tour) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Tour not Found!");
  }
  return tour;
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Tour not Found!");
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
    throw new AppError(StatusCodes.NOT_FOUND, "No tour found with that ID");
  }

  return null;
};

export const TourServices = {
  createTourType,
  updateTourType,
  getAllTourType,
  deleteTourType,
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
  getSingleTour,
};
