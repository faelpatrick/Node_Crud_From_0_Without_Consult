import User from "../models/User";
import "../services/auth";
import { createPasswordHash } from "../services/auth";

class UsersController {

    async index(req, res) {
        try {
            const users = await User.find();
            if (!users) return res.status(404).json();
            return res.json(users);
        } catch (err) {
            console.error(err);
            return res.status(500).json("Internal server error.");
        }
    }
    async show(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (!user) return res.status(404).json();
            return res.json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).json("Internal server error.");
        }
    }
    async create(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (user) return res.status(422).json(`User ${email} already exists.`);
            //Encrypt password
            const encryptedPassword = await createPasswordHash(password);
            const newUser = await User.create({ email, password: encryptedPassword });
            return res.status(201).json(newUser);
        } catch (err) {
            console.error(err);
            return res.status(500).json("Internal server error.");
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { email, password } = req.body;
            const user = await User.findById(id);
            if (!user) return res.status(404).json();
            //Encrypt password
            const encryptedPassword = await createPasswordHash(password);
            await user.updateOne({ email, password: encryptedPassword });
            return res.status(200).json("User updated.");
        } catch (err) {
            console.error(err);
            return res.status(500).json("Internal server error.");
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (!user) return res.status(404).json("User not Found");
            await user.deleteOne();
            return res.status(200).json("User deleted.");
        } catch (err) {
            console.error(err);
            return res.status(500).json("Internal server error.");
        }
    }

}

export default new UsersController();