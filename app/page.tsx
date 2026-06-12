"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            用AI自动化你的Pinterest营销
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
            一次点击，自动发布优质内容。定时发布、智能分析、轻松提升你的Pinterest影响力。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth"
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition transform hover:scale-105"
            >
              🚀 开始免费试用
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 transition"
            >
              查看定价
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600 mb-16">
            <span>✓ 无需信用卡 7 天免费试用</span>
            <span>✓ 随时取消，无合同</span>
            <span>✓ 超过 1000+ 用户信赖</span>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1551431009-381d36ac3a99?w=1000&h=600&fit=crop"
              alt="Pinterest Dashboard"
              className="relative rounded-2xl shadow-2xl border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">核心功能</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
              🎯
            </div>
            <h3 className="text-lg font-bold mb-3">Pinterest OAuth连接</h3>
            <p className="text-gray-600">
              安全连接你的Pinterest账户，一键授权，立即开始发布。
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
              ⏰
            </div>
            <h3 className="text-lg font-bold mb-3">智能定时发布</h3>
            <p className="text-gray-600">
              选择最佳发布时间，Pin会在预定时刻自动发送到Pinterest。
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
              📊
            </div>
            <h3 className="text-lg font-bold mb-3">数据分析</h3>
            <p className="text-gray-600">
              实时查看Pin性能、互动数据，优化你的内容策略。
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
              🔄
            </div>
            <h3 className="text-lg font-bold mb-3">批量管理</h3>
            <p className="text-gray-600">
              支持批量上传、批量编辑，提升工作效率 10 倍。
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
              🎨
            </div>
            <h3 className="text-lg font-bold mb-3">内容编辑器</h3>
            <p className="text-gray-600">
              强大的拖拽编辑器，创建精美的Pin，无需设计技能。
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
              🚀
            </div>
            <h3 className="text-lg font-bold mb-3">API集成</h3>
            <p className="text-gray-600">
              开放 API，与你的现有工具无缝集成，自动化工作流。
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">简单透明的定价</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Free */}
          <div className="p-8 rounded-2xl bg-white border border-gray-200">
            <h3 className="text-xl font-bold mb-2">免费试用</h3>
            <p className="text-gray-600 mb-6">永久免费</p>
            <ul className="space-y-3 text-sm text-gray-700 mb-8">
              <li>✓ 10 个 Pin/月</li>
              <li>✓ 1 个账户连接</li>
              <li>✓ 基础支持</li>
            </ul>
            <button className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">
              选择
            </button>
          </div>

          {/* Pro - Highlighted */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white relative transform md:scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
              推荐
            </div>
            <h3 className="text-xl font-bold mb-2">专业版</h3>
            <p className="text-blue-100 mb-6">$9.9/月</p>
            <ul className="space-y-3 text-sm text-blue-50 mb-8">
              <li>✓ 500 个 Pin/月</li>
              <li>✓ 3 个账户连接</li>
              <li>✓ 定时发布</li>
              <li>✓ 基础分析</li>
              <li>✓ 优先支持</li>
            </ul>
            <button className="w-full px-4 py-2 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition">
              开始免费试用
            </button>
          </div>

          {/* Enterprise */}
          <div className="p-8 rounded-2xl bg-white border border-gray-200">
            <h3 className="text-xl font-bold mb-2">企业版</h3>
            <p className="text-gray-600 mb-6">自定义方案</p>
            <ul className="space-y-3 text-sm text-gray-700 mb-8">
              <li>✓ 无限 Pin</li>
              <li>✓ 无限账户</li>
              <li>✓ 高级分析</li>
              <li>✓ API 完全访问</li>
              <li>✓ 专属客服</li>
            </ul>
            <button className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">
              联系销售
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-8">
          所有套餐包括 7 天免费试用，无需信用卡
        </p>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 sm:p-16 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">准备好提升你的Pinterest了吗？</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            加入 1000+ 内容创作者，使用 Pinterest Pro 自动化你的营销。
          </p>
          <Link
            href="/auth"
            className="inline-block px-8 py-4 rounded-lg bg-white text-blue-600 font-bold hover:shadow-lg transition transform hover:scale-105"
          >
            立即开始 - 完全免费
          </Link>
        </div>
      </section>
    </div>
  );
}

