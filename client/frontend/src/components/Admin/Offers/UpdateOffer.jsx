import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import {
  fetchOffer,
  updateOffer,
} from "../../../redux/slices/offers/OfferSlices";

export default function UpdateOffer() {
  const { code } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { offer, loading, error } = useSelector((state) => state.offers);

  const [formData, setFormData] = useState({
    offerValue: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(fetchOffer(code));
  }, [dispatch, code]);

  useEffect(() => {
    if (offer) {
      setFormData({
        code: offer.offer.code,
        offerValue: offer.offer.offerValue,
        description: offer.offer.description,
        startDate: offer.offer.startDate?.split("T")[0],
        endDate: offer.offer.endDate?.split("T")[0],
      });
    }
  }, [offer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateOffer({ updatedData: formData, id: offer?.offer?._id }))
      .unwrap()
      .then(() => {
        navigate("/admin/manage-offer");
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", "Something went wrong while updating.", "error");
      });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Edit Offer - {code}</h2>

      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorMsg message={error?.message || "Error loading offer"} />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
          <div>
            <label className="block font-medium">Offer Code </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Offer Value (%)</label>
            <input
              type="number"
              name="offerValue"
              value={formData.offerValue}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Update Offer
          </button>
        </form>
      )}
    </div>
  );
}
