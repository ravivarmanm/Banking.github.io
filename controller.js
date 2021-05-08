const User = require("./model/User");
const Table = require("./model/Table.js");

exports.home = function (req, res) {
  res.render("index");
};

exports.viewAllCustomers = async function (req, res) {
  try {
    const users = await User.find();
    res.render("customers", { users });
  } catch (err) {
    req.flash("danger", "Something went wrong");
    res.redirect("back");
  }
};

exports.makeTransaction = async function (req, res) {
  let sender;
  const { email, amount } = req.body;
  try {
    sender = await User.findById(req.params.id);
    const receiver = await User.findOne({ email });
    if (!receiver) {
      //Flash "No receiver has found"
      req.flash("danger", "No receiver has been found,Check receiver email");
      res.redirect(`/customers/${sender._id}/transfer`);
    }
    if (sender.balance >= amount) {
      sender.balance -= amount * 1;
      receiver.balance += amount * 1;
      await Table.create({
        sender: sender.name,
        receiver: receiver.name,
        amount,
        transferredAt: Date.now(),
      });
      //Flash "Payment successful"
      req.flash("success", "Transaction successful");
      await sender.save();
      await receiver.save();
      res.redirect(`/customers/${sender._id}/transfer`);
    } else {
      //Flash "Transaction can't be done"
      req.flash("danger", "Not enough money to transfer");
      res.redirect(`/customers/${sender._id}/transfer`);
    }
  } catch (err) {
    req.flash("danger", "Something went wrong");
    res.redirect(`/customers/${sender._id}/transfer`);
  }
};
exports.getTransactionPage = async function (req, res) {
  const user = await User.findById(req.params.id);
  const info = req.flash("success");
  const errors = req.flash("danger");
  // console.log({ info, errors }, req);
  res.render("transaction", { user, info, errors });
};
exports.getHistory = async function (req, res) {
  const docs = await Table.find();
  res.render("history", { docs });
};
