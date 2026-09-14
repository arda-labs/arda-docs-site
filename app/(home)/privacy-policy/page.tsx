'use client';

import React from 'react';
import {
  Database,
  EyeOff,
  Globe,
  Lock,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
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

const STORAGE_KEYS = [
  { key: 'arda_docs_locale', purpose: { en: 'Documentation language preference (vi/en).', vi: 'Ngôn ngữ hiển thị tài liệu (vi/en).' } },
  { key: 'arda_docs_theme', purpose: { en: 'Color theme preference (light/dark/system).', vi: 'Sở thích giao diện sáng/tối/hệ thống.' } },
  { key: 'arda_docs_lang', purpose: { en: 'Preferred code-snippet language (cURL/Go/TypeScript).', vi: 'Ngôn ngữ snippet ưa thích (cURL/Go/TypeScript).' } },
];

export default function PrivacyPolicyPage() {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';

  return (
    <DocPage>
      <DocHeader
        badge="LEGAL • PRIVACY POLICY"
        badgeTone="neutral"
        meta={isVi ? 'Hiệu lực: 2026' : 'Effective: 2026'}
        title={isVi ? 'Chính sách Quyền riêng tư & Bảo vệ Dữ liệu' : 'Privacy & Data Protection Policy'}
        description={
          isVi
            ? 'Nguyên tắc bảo vệ dữ liệu, cách ly đa người thuê, kiểm soát PII trong telemetry và các cam kết lưu trữ cục bộ trên nền tảng Arda.'
            : 'Data protection principles, multi-tenant isolation, PII controls in telemetry, and browser storage commitments across the Arda platform.'
        }
      />

      <Callout tone="info" icon={Globe} title={isVi ? 'Phạm vi' : 'Scope'}>
        {isVi
          ? 'Áp dụng cho cổng tài liệu docs.arda.io.vn và API edge api.arda.io.vn. Dữ liệu nghiệp vụ của từng tổ chức tài chính do đơn vị đó kiểm soát trên tenant riêng của họ.'
          : 'Applies to the docs.arda.io.vn portal and the api.arda.io.vn edge. Business data belongs to each financial organization and stays under their control on their own tenant.'}
      </Callout>

      <DocSection
        index="1"
        icon={Database}
        title={isVi ? 'Cách ly Dữ liệu Đa người thuê' : 'Multi-Tenant Data Boundaries'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Callout tone="primary" icon={ShieldCheck} title={isVi ? 'Tenant đến từ phiên máy chủ' : 'Tenant comes from the session'}>
            {isVi
              ? 'auth-gateway giải mã phiên và bơm X-Tenant-Id vào request nội bộ; client không thể tự khai tenant trong header. Mỗi service sở hữu database riêng.'
              : 'auth-gateway resolves the session and injects X-Tenant-Id into internal requests; clients cannot assert a tenant header. Each service owns its own database.'}
          </Callout>
          <Callout tone="primary" icon={UserCheck} title={isVi ? 'Đơn vị phải thuộc membership' : 'Org must be in membership'}>
            {isVi
              ? 'Khi chọn đơn vị làm việc, gateway đối chiếu với danh sách membership đã xác minh; sai đơn vị trả 403 organization_forbidden trước khi chạm dữ liệu.'
              : 'When an active org is selected, the gateway validates it against verified membership; a foreign org fails with 403 organization_forbidden before touching data.'}
          </Callout>
          <Callout tone="neutral" icon={Lock} title={isVi ? 'RLS: pilot có kiểm soát' : 'RLS: gated pilot'}>
            {isVi
              ? 'Row-Level Security đã được thử nghiệm trên bảng scratch (SET LOCAL + current_setting(\'arda.tenant_id\')) và bị CI giới hạn không được bật trên bảng production; cách ly hiện tại do tầng ứng dụng thực thi.'
              : 'Row-Level Security has been piloted on scratch tables (SET LOCAL + current_setting(\'arda.tenant_id\')) and CI forbids enabling it on production tables; isolation is currently enforced at the application layer.'}
          </Callout>
          <Callout tone="neutral" icon={Database} title={isVi ? 'Phạm vi dữ liệu theo khách hàng' : 'Customer scoping'}>
            {isVi
              ? 'Các service nghiệp vụ (CRM, loan, deposit...) áp phạm vi theo tổ chức và khách hàng được gán cho actor, tương tự cơ chế tenant.'
              : 'Business services (CRM, loan, deposit...) scope records to the organizations and customers granted to the actor, mirroring tenant isolation.'}
          </Callout>
        </div>
      </DocSection>

      <DocSection
        index="2"
        icon={EyeOff}
        title={isVi ? 'Kiểm soát PII trong Lỗi & Telemetry' : 'PII Controls in Errors & Telemetry'}
      >
        <Callout tone="success" icon={EyeOff} title={isVi ? 'Problem payload không chứa PII' : 'Problem payloads carry no PII'}>
          {isVi
            ? 'Bao đóng RFC 7807 chỉ gồm mã lỗi, thông điệp kỹ thuật, lỗi theo trường, request_id/trace_id. Không có số dư, số thẻ, mật khẩu hay thông tin định danh cá nhân trong error body.'
            : 'The RFC 7807 envelope contains only problem codes, technical messages, per-field errors, and request_id/trace_id. No balances, card numbers, passwords, or personal identifiers appear in error bodies.'}
        </Callout>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Callout tone="info" icon={LockKeyhole} title={isVi ? 'Audit log tự động che dấu' : 'Audit logs auto-redact'}>
            {isVi
              ? 'Bộ ghi audit che các khóa chứa token, secret, password, authorization, cookie trước khi lưu, cả ở payload lồng nhau.'
              : 'The audit writer redacts keys containing token, secret, password, authorization, or cookie before persisting — including nested payloads.'}
          </Callout>
          <Callout tone="info" icon={Lock} title={isVi ? 'Cột mã hóa có đăng ký' : 'Encrypted columns are registered'}>
            {isVi
              ? 'Các cột chứa bí mật (ví dụ mật khẩu SMTP của sender) phải nằm trong registry encrypt column và được CI đối chiếu với hiện thực arda-crypto.'
              : 'Columns holding secrets (for example notification sender SMTP passwords) must be listed in the encrypted-column registry, which CI verifies against the arda-crypto implementation.'}
          </Callout>
        </div>
      </DocSection>

      <DocSection
        index="3"
        icon={ShieldCheck}
        title={isVi ? 'Nhật ký Kiểm toán & Vòng đời Phiên' : 'Audit Trail & Session Lifecycle'}
      >
        <DataTable
          columns={[isVi ? 'Hạng mục' : 'Item', isVi ? 'Cam kết' : 'Commitment']}
          minWidth={620}
          rows={[
            [
              isVi ? 'Sự kiện được ghi' : 'Recorded events',
              isVi
                ? 'Đăng nhập/đăng xuất, cấp/thu quyền, thao tác quản trị, phê duyệt, chạy EOD và các hành vi bảo mật quan trọng.'
                : 'Login/logout, grants/revocations, administrative actions, approvals, EOD runs, and other security-critical events.',
            ],
            [
              isVi ? 'Tính chất' : 'Nature',
              isVi
                ? 'Bản ghi kiểm toán chỉ ghi thêm (append-only), không có API sửa/xóa qua giao diện nghiệp vụ.'
                : 'Audit records are append-only; no business API edits or deletes them.',
            ],
            [
              isVi ? 'Phiên & thiết bị' : 'Sessions & devices',
              isVi
                ? 'Người dùng xem được danh sách phiên/thiết bị và thu hồi; phiên thu hồi bị từ chối ở gateway ngay cả khi token còn hạn.'
                : 'Users can list and revoke sessions/devices; a revoked session is rejected at the gateway even if its token has not expired.',
            ],
            [
              isVi ? 'MFA' : 'MFA',
              isVi
                ? 'Thiết bị MFA và mã dự phòng do người dùng quản lý; mã dự phòng chỉ hiển thị một lần khi tạo.'
                : 'MFA devices and backup codes are user-managed; backup codes are shown only once at creation time.',
            ],
          ]}
        />
      </DocSection>

      <DocSection
        index="4"
        icon={Globe}
        title={isVi ? 'Lưu trữ Trình duyệt & Theo dõi' : 'Browser Storage & Tracking'}
        description={
          isVi
            ? 'Cổng tài liệu chỉ lưu tùy chọn hiển thị trong localStorage; không có cookie theo dõi của bên thứ ba và không có analytics quảng cáo.'
            : 'The documentation portal stores display preferences only in localStorage; there are no third-party tracking cookies and no advertising analytics.'
        }
      >
        <DataTable
          columns={['localStorage key', isVi ? 'Mục đích' : 'Purpose']}
          minWidth={520}
          rows={STORAGE_KEYS.map((entry) => [
            <code key="k" className="font-mono text-[11px] text-primary">
              {entry.key}
            </code>,
            isVi ? entry.purpose.vi : entry.purpose.en,
          ])}
        />
        <Callout tone="neutral" icon={Lock} title={isVi ? 'Cookie của nền tảng ứng dụng' : 'Application platform cookies'}>
          {isVi
            ? 'Ứng dụng nghiệp vụ dùng cookie phiên same-origin (HttpOnly) do auth-gateway phát hành; cookie này không được dùng cho mục đích quảng cáo hay chia sẻ chéo site.'
            : 'The business application uses a same-origin HttpOnly session cookie issued by auth-gateway; it is never used for advertising or cross-site sharing.'}
        </Callout>
      </DocSection>

      <DocSection
        index={5}
        icon={Database}
        title={isVi ? 'Hạ tầng & Vị trí Dữ liệu' : 'Infrastructure & Data Location'}
      >
        <Callout tone="info" title={isVi ? 'Tự vận hành, không analytics bên thứ ba' : 'Self-hosted, no third-party analytics'}>
          {isVi
            ? 'Dữ liệu nghiệp vụ nằm trong PostgreSQL (CloudNativePG) trên cụm K3s tự vận hành của tổ chức; Cloudflare đóng vai trò CDN/WAF/tunnel ở biên, GHCR lưu image. Không có SDK analytics/quảng cáo nào được nhúng trong portal.'
            : 'Business data lives in PostgreSQL (CloudNativePG) on the organization\'s self-hosted K3s cluster; Cloudflare provides edge CDN/WAF/tunnel and GHCR stores images. No analytics or advertising SDKs are embedded in the portal.'}
        </Callout>
      </DocSection>

      <DocSection
        index={6}
        icon={UserCheck}
        title={isVi ? 'Quyền của Chủ thể Dữ liệu & Liên hệ' : 'Data Subject Rights & Contact'}
      >
        <Callout tone="primary" title={isVi ? 'Yêu cầu truy cập/chỉnh sửa' : 'Access & correction requests'}>
          {isVi
            ? 'Yêu cầu liên quan dữ liệu cá nhân gửi tới contact@arda.io.vn; hỗ trợ kỹ thuật tại support@arda.io.vn. Với dữ liệu thuộc tenant của một tổ chức, yêu cầu được chuyển tới đơn vị kiểm soát dữ liệu đó.'
            : 'Personal-data requests go to contact@arda.io.vn; technical support is at support@arda.io.vn. For data owned by a tenant organization, requests are routed to that data controller.'}
        </Callout>
        <Callout tone="neutral" title={isVi ? 'Thay đổi chính sách' : 'Policy changes'}>
          {isVi
            ? 'Chính sách được cập nhật cùng sản phẩm; thay đổi lớn về phạm vi dữ liệu sẽ được phản ánh trên trang này với mốc hiệu lực mới.'
            : 'This policy evolves with the product; material changes to data scope are reflected on this page with a new effective date.'}
        </Callout>
      </DocSection>

      <DocFooterNav
        previous={{ href: '/terms-of-service', label: isVi ? 'Xem lại: Điều khoản Dịch vụ' : 'Previous: Terms of Service' }}
        next={{ href: '/guidelines', label: isVi ? 'Quy chuẩn Kỹ thuật' : 'Engineering Guidelines' }}
      />
    </DocPage>
  );
}
