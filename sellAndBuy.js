const e = require("express");
const express = require("express");
const SellBuy = require("../mongoose/models/sellBuy")

// setting up the router

const sellAndBuyRouter = new express.Router();

// code goes here for routes
//Post call
sellAndBuyRouter.post("/sellProduct", async (req, res) => {
    try {
        const product = new SellBuy(req.body);
        await product.save();
        res.status(201).send({ message: "Product Added" })
    }
    catch (e) {
        if (e.errors.productName) {
            return res.status(400).send({ error: e.errors.productName.message });
        }
        if (e.errors.costPrice) {
            res.status(400).send({ error: e.errors.costPrice.message });
        }
    }

})

//Patch call
sellAndBuyRouter.patch("/sellProduct/:id", async (req, res) => {
    try {
        debugger
        const id = req.params.id;
        await SellBuy.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).send({ message: "Updated Successfully" })
    }
    catch (e) {
        if (e.errors.soldPrice)
            res.status(400).send({ error: e.errors.soldPrice.message })
    }
})

//Delete call
sellAndBuyRouter.delete("/sellProduct/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await SellBuy.findByIdAndDelete(id);
        res.status(200).send({ message: "Deleted successfully" })
    }
    catch (e) {
        res.status(400).send()
    }
})

//get call
sellAndBuyRouter.get("/sellProduct", async (req, res) => {
    try {
        if (!req.query.product && !req.query.sortBy) {
            const items = await SellBuy.find({});
            res.status(200).send(items);
            return;
        } else if (req.query.product) {
            const item = await SellBuy.find({ productName: req.query.product });
            res.status(200).send(item);
            return;
        } else if (req.query.sortBy) {
            switch (req.query.sortBy) {
                case "lowerCostPrice": {
                    const items = await SellBuy.find({}).sort({ costPrice: "asc" });
                    res.status(200).send(items);
                    break;
                }
                case "higherCostPrice": {
                    const hitems = await SellBuy.find({}).sort({ costPrice: "desc" });
                    res.status(200).send(hitems);
                    break;
                }
                case "lowerSoldPrice": {
                    const ls = await SellBuy.find({}).sort({ soldPrice: "asc" });
                    res.status(200).send(ls);
                    break;
                }
                case "higherSoldPrice": {
                    const hs = await SellBuy.find({}).sort({ soldPrice: "desc" });
                    res.status(200).send(hs);
                    break;
                }

            }
        }
    } catch (e) {
        res.status(400).send(e);
    }
})



// exporting the router

module.exports = sellAndBuyRouter;


