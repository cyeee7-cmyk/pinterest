"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState<any[]>([]);
  const [pinterestConnected, setPinterestConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/auth");
    checkPinterestStatus(token);
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success) setMessage(success);
    if (error) setMessage(error);
  }, [router, searchParams]);

  const checkPinterestStatus = async (token: string | null) => {
    if (!token) return;
    try {
      const res = await fetch("/api/pinterest/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPinterestConnected(data.connected);
    } catch (error) {
      console.error("Failed to check Pinterest status:", error);
    }
  };

  const handleConnectPinterest = () => {
    window.location.href = "/api/pinterest/authorize";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinterestConnected) {
      alert("请先连接Pinterest账户");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = scheduledAt ? "/api/pins/schedule" : "/api/pins/create";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          scheduledAt: scheduledAt || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(scheduledAt ? "Pin已安排定时发布!" : "Pin发布成功!");
        setPins([data.pin, ...pins]);
        setTitle("");
        setDescription("");
        setImageUrl("");
        setScheduledAt("");
        setActiveTab("pins");
      } else {
        alert(data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; bg: string; color: string }> = {
      draft: { text: "📝 草稿", bg: "bg-gray-100", color: "text-gray-700" },
      scheduled: { text: "⏰ 定时中", bg: "bg-blue-100", color: "text-blue-700" },
      published: { text: "✅ 已发布", bg: "bg-green-100", color: "text-green-700" },
    };
    const badge = badges[status] || badges.draft;
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">管理你的Pinterest内容</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            {message}
          </div>
        )}

        {!pinterestConnected && (
          <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-red-900 mb-1">需要连接Pinterest</h3>
                <p className="text-red-800 text-sm">连接你的Pinterest账户才能发布Pin</p>
              </div>
              <button
                onClick={handleConnectPinterest}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition whitespace-nowrap"
              >
                🔗 连接Pinterest
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 border-b border-gray-200 flex gap-8">
          <button
            onClick={() => setActiveTab("create")}
            className={`pb-4 font-medium transition ${
              activeTab === "create"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📝 创建Pin
          </button>
          <button
            onClick={() => setActiveTab("pins")}
            className={`pb-4 font-medium transition ${
              activeTab === "pins"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📌 我的Pins ({pins.length})
          </button>
        </div>

        {activeTab === "create" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold mb-6">创建新Pin</h2>
                {!pinterestConnected ? (
                  <button
                    onClick={handleConnectPinterest}
                    className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:shadow-lg transition"
                  >
                    🔗 连接Pinterest账户
                  </button>
                ) : (
                  <>
                    <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                      ✓ Pinterest已连接
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
                        <input
                          type="text"
                          placeholder="输入Pin标题"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                        <textarea
                          placeholder="输入Pin描述"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">图片URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">定时发布 (可选)</label>
                        <input
                          type="datetime-local"
                          value={scheduledAt}
                          onChange={(e) => setScheduledAt(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {scheduledAt && (
                          <p className="text-sm text-gray-600 mt-2">
                            将在 {new Date(scheduledAt).toLocaleString("zh-CN")} 发布
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !pinterestConnected}
                        className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                      >
                        {loading ? "处理中..." : scheduledAt ? "⏰ 安排发布" : "📤 立即发布"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-bold mb-4">预览</h3>
                {imageUrl ? (
                  <div className="space-y-4">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full rounded-lg object-cover max-h-96"
                    />
                    <div>
                      <h4 className="font-bold text-lg mb-2">{title || "输入标题..."}</h4>
                      <p className="text-gray-600">{description || "输入描述..."}</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    输入图片URL查看预览
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "pins" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold mb-6">我的Pins</h2>
            {pins.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">暂无Pins，创建你的第一个Pin吧！</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pins.map((pin) => (
                  <div key={pin.id} className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
                    <img
                      src={pin.imageUrl}
                      alt={pin.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-sm flex-1">{pin.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{pin.description}</p>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(pin.status)}
                        {pin.scheduledAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(pin.scheduledAt).toLocaleDateString("zh-CN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
