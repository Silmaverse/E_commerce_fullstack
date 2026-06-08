const { uploadToCloudinary } = require("../helpers/util");
const categorySchema = require("../models/categorySchema");
const { product, product } = require("../models/prodcutSchema");

const createProduct=async(req,res)=>{
    try{
     const{title,slug,description,category,price,discountpercentage,variants,tags,isActive}=req.body;

     const thumbnail=req.files?.thumbnail;
     const images=req.files?.images;

     if(!title) return res.status(400).send({messgae:"Prodcut Tilte is required"});
     if(!slug) return res.status(400).send({messgae:"slug is required"});
     const isSlugExist=await product.findOne({
        slug:slug.toLowerCase(),
     });
     if(isSlugExist) return res.status(400).send({messgae:"Slug already exist"});
     if(!description) return res.status(400).send({messsage:"Description is required"});
     if(!category) return res.status(400).send({messsage:"Category is required"});
     const isCategoryExist=await categorySchema.findById(category);
     if(!isCategoryExist) return res.status(400).send({messsage:"Invalid Category"});
     if(!price) return res.status(400).send({messsage:"Prodcut Price is required"});

     const variantsdata=JSON.parse(variants);

     if(!Array.isArray(variantsdata)|| variantsdata.length==0) 
        return res.status(400).send({message:"Minumum 1 variant is required"})
    for(const variant of variants){
      if(!variant.sku) return res.status(400).send({msg:"Sku is required"});  
      if(!variant.color) return res.status(400).send({msg:"Color is required"});
      if(!variant.size) return res.status(400).send({msg:"Size is required"});
      if(!variant.stock|| variant.stock<1) return res.status(400).send({msg:"Stock is required and must be more then 0"});

    }
    const skus=variantsdata.map((v)=>v.sku);
    if(new Set(skus).size !== skus.length )
        return  res.status(400).send({messgae:"SKU must be unique"});

    //image validation and upload

    if(!thumbnail || thumbnail.length==0)
        return res.status(400).send({message:"Product thumbnail is required"});

    if(!images || images.length==0)
        return res.status(400).send({message:"Product Image is required"});

    const thumbnailurl= await uploadToCloudinary({
       mimetype:thumbnail[0].mimetype, 
       imgbuffer:thumbnail[0].imgbuffer
    });

    const imgsres = images.map(async (item)=>{
      return uploadToCloudinary({
        mimetype:item.mimetype,
        imgBuffer:item.buffer,
      })  
    });
    
    const imagesUrls=await Promise.all(imgsres);

    const productdata=await product.create({
        title,
        slug,
        description,
        category,
        price,
        discountpercentage,
        variants:variantsdata,
        tags,
        isActive,
        thumbnail:thumbnailurl,
        images:imagesUrls,
    });
    res.status(200).send({messgae:"Product created successfully",productdata});
    }catch(error){
        console.log(error)
    }
}

module.exports={createProduct};