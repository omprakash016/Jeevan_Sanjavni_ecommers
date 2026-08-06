import Counter from "../modules/counter/counter.model.js";

export const generateOrderNumber = async (session) => {

  const counter = await Counter.findByIdAndUpdate(
    "order",
    {
      $inc: {
        sequenceValue: 1,
      },
    },
    {
      new: true,
      upsert: true,
      session,
    }
  );

  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  const date = `${year}${month}${day}`;

  const sequence = counter.sequenceValue
    .toString()
    .padStart(6, "0");

  return `ORD${date}${sequence}`;
};