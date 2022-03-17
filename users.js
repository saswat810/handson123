const express = require("express");
const Course = require("../mongoose/models/courses");

//setting up the student router
const usersRouter = new express.Router();

//write your code here
usersRouter.get("/courses/get", async (req, res) => {
    try {
        const user = await Course.find({})
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send()
    }
})
usersRouter.post("/courses/enroll/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (course.isApplied) {
            res.status(403).send()
            return;
        }
        await Course.findByIdAndUpdate(req.params.id, { isApplied: true }, { new: true, runValidators: true })
        res.status(200).send()
    }
    catch (e) { }
})

usersRouter.delete("/courses/drop/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)

        if (!course.isApplied) {
            res.status(403).send()
            return;
        }
        await Course.findByIdAndUpdate(req.params.id,
            { isApplied: false, isRated: false }, { new: true, runValidators: true })
        res.status(200).send()
    }
    catch (e) {
        res.status(400).send(e)

    }
})
usersRouter.patch("/courses/rating/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course.isRated) {
            res.status(403).send();
        }
        if (!course.isApplied) {
            res.status(403).send();
        }
        if (!course.isRated) {
            const rat = (uR, noR, aR) => {
                return (((aR * noR) + uR) / (noR + 1)).toFixed(1);
            }
            await Course.findByIdAndUpdate(req.params.id,
                {
                    rating: rat(req.body.rating, course.noOfRatings, course.rating),
                    noOfRatings: course.noOfRatings + 1,
                    isRated: true
                });
            res.status(200).send()
        }

    } catch (e) { }
})



module.exports = usersRouter;
