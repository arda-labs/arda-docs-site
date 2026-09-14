'use client';

import React from 'react';
import {
  AlertCircle,
  FileText,
  RefreshCw,
  Scale,
  Shield,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { usePortalI18n } from '@/components/provider';
import {
  Callout,
  DataTable,
  DocFooterNav,
  DocHeader,
  DocPage,
  DocSection,
} from '@/components/doc-page';
import { AUTH_FACTS, PLATFORM_FACTS } from '@/lib/platform';

export default function TermsOfServicePage() {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';

  return (
    <DocPage>
      <DocHeader
        badge="LEGAL • TERMS OF SERVICE"
        badgeTone="neutral"
        meta={isVi ? 'Hiệu lực: 2026' : 'Effective: 2026'}
        title={isVi ? 'Điều khoản Dịch vụ Nền tảng' : 'Platform Terms of Service'}
        description={
          isVi
            ? 'Điều khoản chi phối việc truy cập, tích hợp API, sử dụng tài nguyên và khai thác tài liệu trên nền tảng Arda Core Banking.'
            : 'Terms governing access, API integration, resource usage, and documentation retrieval across the Arda Core Banking platform.'
        }
      />

      <Callout tone="info" icon={FileText} title={isVi ? 'Phạm vi áp dụng' : 'Scope'}>
        {isVi
          ? 'Áp dụng cho mọi truy cập vào cổng tài liệu docs.arda.io.vn, API edge api.arda.io.vn và các ứng dụng web của nền tảng. Bằng việc truy cập hoặc gọi API, bạn đồng ý với các điều khoản dưới đây.'
          : 'These terms apply to every access of the docs.arda.io.vn portal, the api.arda.io.vn edge, and the platform web applications. By accessing the platform or calling its APIs you accept the terms below.'}
      </Callout>

      <DocSection
        index="1"
        icon={Shield}
        title={isVi ? 'Tài khoản & Kiểm soát Truy cập' : 'Accounts & Access Control'}
      >
        <DataTable
          columns={[isVi ? 'Cơ chế' : 'Control', isVi ? 'Quy định' : 'Rule']}
          minWidth={620}
          rows={[
            [
              'OAuth2 / OIDC',
              isVi
                ? 'Phiên web được cấp qua Ory Hydra + Ory Kratos phía sau auth-gateway (BFF). Nghiêm cấm mạo danh người dùng, giả mạo token hoặc tự gắn header định danh vào request.'
                : 'Web sessions are issued through Ory Hydra + Ory Kratos behind the auth-gateway (BFF). Impersonating users, forging tokens, or self-asserting identity headers is prohibited.',
            ],
            [
              isVi ? 'Xác thực tăng cường' : 'Step-up auth',
              isVi
                ? `Thao tác rủi ro cao (theo policy) yêu cầu recent auth trong ${AUTH_FACTS.recentAuthWindowSeconds} giây; hệ thống trả 403 recent_auth_required nếu phiên đã cũ.`
                : `High-risk operations (per policy) require recent auth within ${AUTH_FACTS.recentAuthWindowSeconds} seconds; the platform answers 403 recent_auth_required for stale sessions.`,
            ],
            [
              'MFA',
              isVi
                ? 'Tài khoản quản trị yêu cầu xác thực đa yếu tố; tắt/không đăng ký MFA có thể khiến quyền truy cập bị chặn.'
                : 'Administrator accounts require multi-factor authentication; disabling or never enrolling MFA may block access.',
            ],
            [
              isVi ? 'Ngữ cảnh tenant' : 'Tenant context',
              isVi
                ? 'Tenant lấy từ phiên máy chủ; client không thể tự khai. Chuyển tenant chỉ diễn ra qua POST /api/auth/tenant/switch với membership đã xác minh.'
                : 'Tenant is resolved from the server session and cannot be client-asserted. Switching tenants only happens via POST /api/auth/tenant/switch with a verified membership.',
            ],
            [
              isVi ? 'Phiên & thu hồi' : 'Sessions & revocation',
              isVi
                ? `Phiên Kratos cấu hình thời hạn ${AUTH_FACTS.kratosSessionLifespan}; người dùng có thể xem và thu hồi phiên/thiết bị của mình.`
                : `Kratos sessions are configured with a ${AUTH_FACTS.kratosSessionLifespan} lifespan; users can review and revoke their sessions/devices.`,
            ],
          ]}
        />
      </DocSection>

      <DocSection
        index="2"
        icon={Terminal}
        title={isVi ? 'Sử dụng API & Hạn ngạch' : 'API Usage & Quotas'}
      >
        <DataTable
          columns={[isVi ? 'Nội dung' : 'Topic', isVi ? 'Quy định' : 'Rule']}
          minWidth={620}
          rows={[
            [
              isVi ? 'Điểm vào duy nhất' : 'Single ingress',
              isVi
                ? 'Mọi lưu lượng API đi qua https://api.arda.io.vn; gọi thẳng microservice nội bộ là không được hỗ trợ và có thể bị chặn ở biên.'
                : 'All API traffic goes through https://api.arda.io.vn; calling internal microservices directly is unsupported and blocked at the edge.',
            ],
            [
              isVi ? 'Giới hạn tần suất' : 'Rate limits',
              isVi
                ? `Endpoint AI có hạn ngạch theo người dùng/tenant (mặc định ${AUTH_FACTS.aiRateLimitPerMinute} request/phút) và trả 429 kèm chính sách retry; các surface khác có thể bị giới hạn ở tầng edge.`
                : `AI endpoints enforce a per-user/tenant quota (default ${AUTH_FACTS.aiRateLimitPerMinute} requests/minute) and answer 429 with a retry policy; other surfaces may be throttled at the edge.`,
            ],
            [
              isVi ? 'Retry đúng cách' : 'Correct retry',
              isVi
                ? 'Khi nhận 429/5xx, client phải backoff (tuân thủ Retry-After khi có) và ghi lại request_id; không được retry mù theo vòng lặp dày.'
                : 'On 429/5xx, clients must back off (honouring Retry-After when present) and record request_id; tight blind retry loops are prohibited.',
            ],
            [
              isVi ? 'Tra cứu công khai' : 'Public lookup',
              isVi
                ? 'API /api/lookup trên docs.arda.io.vn mở CORS * cho công cụ CLI/AI agent; dữ liệu trả về là đặc tả lỗi, không chứa dữ liệu khách hàng.'
                : 'The /api/lookup API on docs.arda.io.vn is CORS-open for CLI/AI tooling; it returns problem specifications only, never customer data.',
            ],
          ]}
        />
      </DocSection>

      <DocSection
        index="3"
        icon={ShieldCheck}
        title={isVi ? 'Toàn vẹn Giao dịch & Sổ cái' : 'Transaction & Ledger Integrity'}
        description={
          isVi
            ? 'Nền tảng bảo vệ bất biến tài chính ở tầng hạch toán; client không thể bỏ qua các kiểm tra này.'
            : 'Financial invariants are enforced at the posting layer; clients cannot bypass them.'
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Callout tone="primary" title={isVi ? 'Nợ = Có theo loại tiền' : 'Debit = Credit per currency'}>
            {isVi
              ? 'Mọi bút toán phải cân bằng và đúng loại tiền; tài khoản phải đúng nature. Vi phạm bị từ chối bằng problem envelope.'
              : 'Every entry must balance in its own currency against accounts of the correct nature. Violations are rejected with a problem envelope.'}
          </Callout>
          <Callout tone="primary" title={isVi ? 'Idempotency' : 'Idempotency'}>
            {isVi
              ? 'Client nên gửi idempotency_key cho giao dịch tài chính; phát lại cùng key sẽ trả kết quả cũ thay vì ghi trùng.'
              : 'Clients should send an idempotency_key for financial operations; replaying the same key returns the original result instead of double-posting.'}
          </Callout>
          <Callout tone="warning" title={isVi ? 'Kỳ kế toán & đảo bút toán' : 'Periods & reversal'}>
            {isVi
              ? 'Ghi sổ/đảo bút toán chỉ hợp lệ trong kỳ mở; đảo bút toán tạo liên kết tới bút toán gốc và không sửa/xóa dữ liệu gốc.'
              : 'Posting and reversal are only valid in an open period; reversals link back to the original entry and never edit or delete it.'}
          </Callout>
          <Callout tone="warning" title={isVi ? 'Quy trình phê duyệt' : 'Approval workflows'}>
            {isVi
              ? 'Các luồng maker-checker chạy trên Zeebe; kết quả phê duyệt là điều kiện để side effect nghiệp vụ được thực thi.'
              : 'Maker-checker flows run on Zeebe; the approval outcome gates each domain side effect.'}
          </Callout>
        </div>
      </DocSection>

      <DocSection
        index="4"
        icon={Scale}
        title={isVi ? 'Tài liệu & Sở hữu Trí tuệ' : 'Documentation & Intellectual Property'}
      >
        <Callout tone="neutral" icon={FileText} title={isVi ? 'Cấp phép sử dụng tài liệu' : 'Documentation licence'}>
          {isVi
            ? `Đặc tả ${PLATFORM_FACTS.policyRoutes} route, danh mục ${PLATFORM_FACTS.services} service, mã lỗi RFC 7807 và snippet mẫu (cURL/Go/TypeScript) được cung cấp "nguyên trạng" cho mục đích tích hợp. Bạn được phép dùng nội dung để xây dựng tích hợp; không được bán lại như sản phẩm tài liệu độc lập hoặc xóa thông tin nguồn.`
            : `Route specifications, the ${PLATFORM_FACTS.services}-service inventory, RFC 7807 problem codes, and sample snippets (cURL/Go/TypeScript) are provided as-is for integration purposes. You may build integrations from this content; reselling it as a standalone documentation product or stripping attribution is not permitted.`}
        </Callout>
      </DocSection>

      <DocSection
        index="5"
        icon={RefreshCw}
        title={isVi ? 'Thay đổi & Khả dụng' : 'Changes & Availability'}
      >
        <DataTable
          columns={[isVi ? 'Nội dung' : 'Topic', isVi ? 'Cam kết' : 'Commitment']}
          minWidth={620}
          rows={[
            [
              isVi ? 'Phiên bản tài liệu' : 'Documentation versions',
              isVi
                ? 'Tài liệu phản ánh trạng thái hiện tại của hệ thống; trang đặc tả lỗi được sinh tự động từ nguồn arda-be khi build.'
                : 'Documentation reflects the current system state; problem specification pages are generated from the arda-be source at build time.',
            ],
            [
              isVi ? 'Thay đổi hành vi API' : 'API behaviour changes',
              isVi
                ? 'Mã lỗi là hợp đồng ổn định; khi hành vi đổi, trang đặc tả và OpenAPI được cập nhật trong cùng thay đổi và ghi qua lịch sử commit.'
                : 'Problem codes are a stable contract; when behaviour changes, the spec page and OpenAPI are updated in the same change and tracked through commit history.',
            ],
            [
              isVi ? 'Bảo trì' : 'Maintenance',
              isVi
                ? 'Hệ thống chạy trên cụm tự vận hành; cửa sổ bảo trì và rollout được thực hiện qua GitOps, có thể tạm gián đoạn ngắn.'
                : 'The platform runs on a self-hosted cluster; maintenance and rollouts happen through GitOps and may cause brief interruptions.',
            ],
            [
              isVi ? 'Không cam kết SLA mặc định' : 'No default SLA',
              isVi
                ? 'Trừ khi có hợp đồng riêng bằng văn bản, nền tảng không kèm cam kết mức dịch vụ (SLA) cho môi trường dev/demo.'
                : 'Unless separately agreed in writing, no service-level agreement (SLA) applies to development or demo environments.',
            ],
          ]}
        />
      </DocSection>

      <DocSection
        index="6"
        icon={AlertCircle}
        title={isVi ? 'Hành vi Bị cấm & Chấm dứt' : 'Prohibited Use & Termination'}
      >
        <Callout tone="danger" title={isVi ? 'Hành vi bị cấm' : 'Prohibited'}>
          {isVi
            ? 'Mạo danh tenant/người dùng; dò quét hoặc khai thác lỗ hổng; gây tải bất thường; khai thác dữ liệu hàng loạt ngoài phạm vi được cấp; can thiệp vào nhật ký kiểm toán.'
            : 'Impersonating tenants/users; probing or exploiting vulnerabilities; generating abnormal load; bulk-extracting data beyond granted scope; tampering with audit logs.'}
        </Callout>
        <Callout tone="warning" title={isVi ? 'Chế tài' : 'Enforcement'}>
          {isVi
            ? 'Vi phạm có thể dẫn tới thu hồi phiên, khóa tài khoản hoặc chặn IP/client ở biên; hành vi phá hoại sổ cái/kiểm toán được ghi nhận trong audit log bất biến.'
            : 'Violations may lead to session revocation, account lockout, or edge-level blocking of the IP/client; ledger or audit tampering is captured in the append-only audit log.'}
        </Callout>
      </DocSection>

      <DocSection
        index="7"
        icon={FileText}
        title={isVi ? 'Liên hệ & Hiệu lực' : 'Contact & Effect'}
      >
        <Callout tone="info" title={isVi ? 'Kênh liên hệ' : 'Contact channels'}>
          {isVi
            ? 'Câu hỏi pháp lý/điều khoản: contact@arda.io.vn · Hỗ trợ kỹ thuật: support@arda.io.vn · Báo lỗi bảo mật: kèm request_id và không gửi kèm dữ liệu khách hàng.'
            : 'Legal/terms questions: contact@arda.io.vn · Technical support: support@arda.io.vn · Security reports: include request_id and never attach customer data.'}
        </Callout>
      </DocSection>

      <DocFooterNav
        previous={{ href: '/about', label: isVi ? 'Xem lại: Giới thiệu Nền tảng' : 'Previous: About the Platform' }}
        next={{ href: '/privacy-policy', label: isVi ? 'Xem Chính sách Quyền riêng tư' : 'View Privacy Policy' }}
      />
    </DocPage>
  );
}
