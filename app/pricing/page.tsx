"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth";
        return;
      }

      // 创建Checkout Session
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { sessionId } = await res.json();

      // 重定向到Stripe Checkout
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
      );

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("支付失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">简单透明的定价</h1>
          <p className="text-xl text-gray-600">$9.9/月，随时取消</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-2xl font-bold mb-4">免费试用</h3>
            <p className="text-4xl font-bold mb-2">$0</p>
            <p className="text-gray-600 mb-6">永久免费</p>
            <ul className="space-y-4 mb-8 text-left">
              <li>✅ 连接1个Pinterest账户</li>
              <li>✅ 发布10个Pin/月</li>
              <li>❌ 定时发布</li>
              <li>❌ 分析数据</li>
            </ul>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-bold cursor-not-allowed"
            >
              当前套餐
            </button>
          </div>

          {/* Pro Plan - HIGHLIGHTED */}
          <div className="bg-blue-600 text-white rounded-lg shadow p-8 transform scale-105">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-yellow-400 text-blue-600 px-4 py-1 rounded-full font-bold">
                推荐
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4 mt-4">专业版</h3>
            <p className="text-4xl font-bold mb-2">$9.9</p>
            <p className="text-blue-100 mb-6">/月，随时取消</p>
            <ul className="space-y-4 mb-8 text-left">
              <li>✅ 连接3个Pinterest账户</li>
              <li>✅ 500个Pin/月</li>
              <li>✅ 定时发布</li>
              <li>✅ 基础分析</li>
            </ul>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-blue-50 disabled:opacity-50"
            >
              {loading ? "处理中..." : "立即订阅"}
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-2xl font-bold mb-4">企业版</h3>
            <p className="text-4xl font-bold mb-2">联系我们</p>
            <p className="text-gray-600 mb-6">自定义方案</p>
            <ul className="space-y-4 mb-8 text-left">
              <li>✅ 无限账户</li>
              <li>✅ 无限Pin</li>
              <li>✅ 高级分析</li>
              <li>✅ 优先支持</li>
            </ul>
            <button
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-300"
            >
              邮件咨询
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            所有套餐包括 7 天免费试用，无需信用卡
          </p>
        </div>
      </div>
    </div>
  );
}
