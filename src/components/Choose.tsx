import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useHousehold } from "../context/HouseholdContext";
import { createHousehold, joinHousehold } from "../apis/choose";
import axios from "axios";

const WEBHOOK_URL = "http://localhost:5678/webhook-test/household";

const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-2 text-gray-100 hover:text-gray-700 text-2xl"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

const Choose = () => {
  const { user, token } = useAuth();
  const { setHouseholdData } = useHousehold();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const [createForm, setCreateForm] = useState({ name: "", invite_code: "" });
  const [joinCode, setJoinCode] = useState("");

  const sendWebhook = async (householdId: number) => {
    try {
      await axios.post(WEBHOOK_URL, {
        token,
        householdId,
        userId: user?.id,
      });
      console.log("Sent to n8n");
    } catch (e) {
      console.error("Webhook failed:", e);
    }
  };

  const createMutation = useMutation({
    mutationFn: () => createHousehold(token!, createForm),
    onSuccess: async (data) => {
      const payload = data.payload;

      setHouseholdData({
        id: payload.id,
        name: payload.name,
      });

      await sendWebhook(payload.id);

      alert("Household created!");
      setCreateForm({ name: "", invite_code: "" });
      setShowCreateModal(false);
      navigate("/householdMain");
    },
    onError: () => alert("Error creating household"),
  });

  const joinMutation = useMutation({
    mutationFn: () => joinHousehold(token!, joinCode),
    onSuccess: async (data) => {
      const payload = data.payload;

      setHouseholdData({
        id: payload.id,
        name: payload.name,
      });

      await sendWebhook(payload.id);

      alert("Joined household!");
      setJoinCode("");
      setShowJoinModal(false);
      navigate("/householdMain");
    },
    onError: () => alert("Invalid join code"),
  });

  return (
    <section className="min-h-screen w-screen bg-gradient-to-br from-green-100 to-amber-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm md:max-w-md bg-white flex flex-col items-center gap-3 rounded-xl shadow-lg p-10">
        <Link
          to="/"
          className="self-start mb-4 !text-gray-600 hover:text-amber-500 flex items-center"
        >
          ← Back to Home
        </Link>

        <h1 className="text-xl font-bold text-emerald-800">Choose to</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full p-2 !bg-amber-500 rounded-xl mt-3 hover:bg-amber-600 text-white"
        >
          Create a Household
        </button>

        <button
          onClick={() => setShowJoinModal(true)}
          className="w-full p-2 !bg-amber-500 rounded-xl mt-3 hover:bg-amber-600 text-white"
        >
          Join a Household
        </button>
      </div>

      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <h3 className="text-xl font-black text-emerald-900 mb-4">
            Create your Household
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Household Name <span className="!text-red-500">*</span>
              </label>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-gray-800"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Invite Code (Optional)</label>
              <input
                type="text"
                value={createForm.invite_code}
                onChange={(e) =>
                  setCreateForm({ ...createForm, invite_code: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md text-gray-800"
                placeholder="Fam123"
              />
            </div>

            <button
              onClick={() => {
                if (!createForm.name.trim()) return alert("Name is required");
                createMutation.mutate();
              }}
              className="w-full p-2 !bg-amber-500 text-white rounded-xl hover:bg-amber-600"
            >
              Create
            </button>
          </div>
        </Modal>
      )}

      {showJoinModal && (
        <Modal onClose={() => setShowJoinModal(false)}>
          <h3 className="text-xl font-black text-emerald-900 mb-4">Join a Household</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Join Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-gray-800"
                placeholder="Household code"
              />
            </div>

            <button
              onClick={() => {
                if (!joinCode.trim()) return alert("Join code is required");
                joinMutation.mutate();
              }}
              className="w-full p-2 !bg-amber-500 text-white rounded-xl hover:bg-amber-600"
            >
              Join
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default Choose;
