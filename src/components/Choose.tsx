import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useHousehold } from '../context/HouseholdContext';

const Choose = () => {
  const { user, token } = useAuth();
  const { setHouseholdData } = useHousehold();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [newHousehold, setNewHousehold] = useState({
    name: '',
    invite_code: ''
  });

  const navigate = useNavigate();

  const WEBHOOK_URL = "http://localhost:5678/webhook-test/household";

  const addHouseholdMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        'http://127.0.0.1:8000/api/v0.1/household/add',
        newHousehold,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },

    onSuccess: async (data) => {
      const payload = data.payload;

      setHouseholdData({
        id: payload.id,
        name: payload.name
      });

      try {
        await axios.post(WEBHOOK_URL, {
          token: token,
          householdId: payload.id,
          userId: user?.id
        });
        console.log("Sent to n8n successfully");
      } catch (err) {
        console.error("Failed sending to n8n:", err);
      }

      alert("Household created successfully!");
      setNewHousehold({ name: '', invite_code: '' });
      setIsModalOpen(false);
      navigate("/householdMain");
    },

    onError: (error) => {
      console.error(error);
      alert("Failed to create household.");
    }
  });

  const joinHouseholdMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        'http://127.0.0.1:8000/api/v0.1/household/join',
        { invite_code: code },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },

    onSuccess: async (data) => {
      const payload = data.payload;

      setHouseholdData({
        id: payload.id,
        name: payload.name
      });

      try {
        await axios.post(WEBHOOK_URL, {
          token: token,
          householdId: payload.id,
          userId: user?.id
        });
        console.log("Sent to n8n successfully");
      } catch (err) {
        console.error("Failed sending to n8n:", err);
      }

      alert("Joined household successfully!");
      setCode("");
      setIsCodeModalOpen(false);
      navigate("/householdMain");
    },

    onError: () => {
      alert("Failed to join household");
    }
  });

  const handleAddHousehold = () => {
    if (!newHousehold.name.trim()) {
      alert("Please enter a household name.");
      return;
    }
    addHouseholdMutation.mutate();
  };

  const handleJoinHousehold = () => {
    if (!code.trim()) {
      alert("Please enter a join code.");
      return;
    }
    joinHouseholdMutation.mutate();
  };

  return (
    <section className="min-h-screen w-screen bg-gradient-to-br from-green-100 to-amber-100 flex items-center justify-center">
      <div className="w-full max-w-sm md:max-w-md bg-white flex flex-col items-center gap-3 rounded-xl shadow-lg p-10">

        <Link to="/" className="self-start mb-4 text-gray-600 hover:text-amber-500 flex items-center">
          ← Back to Home
        </Link>

        <h1 className="text-xl font-bold text-emerald-800">Choose to</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full p-2 bg-amber-500 rounded-xl mt-3 hover:bg-amber-600 text-white"
        >
          Create a Household
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-emerald-900">Creating your Household...</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>

              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newHousehold.name}
                    onChange={(e) =>
                      setNewHousehold({ ...newHousehold, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:ring-green-500"
                    placeholder="Household name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    value={newHousehold.invite_code}
                    onChange={(e) =>
                      setNewHousehold({ ...newHousehold, invite_code: e.target.value })
                    }
                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:ring-green-500"
                    placeholder="Fam123"
                  />
                </div>

                <button
                  onClick={handleAddHousehold}
                  className="w-full p-2 bg-amber-500 rounded-xl text-white hover:bg-amber-600"
                >
                  Create Household
                </button>

              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCodeModalOpen(true)}
          className="w-full p-2 bg-amber-500 rounded-xl mt-3 hover:bg-amber-600 text-white"
        >
          Join a Household
        </button>

        {isCodeModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">

              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setIsCodeModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>

              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Join Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:ring-green-500"
                    placeholder="Household Code"
                  />
                </div>

                <button
                  onClick={handleJoinHousehold}
                  className="w-full p-2 bg-amber-500 rounded-xl text-white hover:bg-amber-600"
                >
                  Join Household
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Choose;
