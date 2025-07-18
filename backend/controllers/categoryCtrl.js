import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";

export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
 
    //category exists
    const categoryFound = await Category.findOne({ name });
    if (categoryFound) {
      throw new Error("Category already exists");
    }
    //create
    const category = await Category.create({
      name: name?.toLowerCase(),
      user: req.userAuthId,
      image: req?.file?.path,
    });
  
    res.json({
      status: "success",
      message: "Category created successfully",
      category,
    });
  });
  

  export const getAllCategories= asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ createdAt: -1 });;
    res.json({
      status: "success",
      message: "Categories fetched successfully",
      categories,
    });
  });

  export const getSingleCategory= asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.json({
      status: "success",
      message: "Category fetched successfully",
      category,
    });
  });

  export const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    console.log(req.body)
    
    let updateData = { name };
    

    if (req.file) {
      updateData.image = req.file.path; // Assuming the path of the uploaded file is stored in the database
    }

    // const category = await Category.findByIdAndUpdate(req.params.id,{name,image},{new:true});
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    // if (existingCategory) {
    //     return res.status(400).json({
    //         status: "error",
    //         message: "Category with this name already exists",
    //     });
    // }
  
    //update
    // const category = await Category.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     name,
    //   },
    //   {
    //     new: true,
    //   }
    // );
    res.json({
      status: "success",
      message: "category updated successfully",
      category,
    });
  });
  

  export const deleteCategory = asyncHandler(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      message: "Category deleted successfully",
    });
  });