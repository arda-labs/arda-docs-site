'use client';

import React from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Gauge,
  Layers,
  Workflow,
} from 'lucide-react';
import { usePortalI18n } from '@/components/provider';
import {
  Callout,
  CodeBlock,
  DataTable,
  DocFooterNav,
  DocHeader,
  DocPage,
  DocSection,
  StatCard,
} from '@/components/doc-page';
import { AUTH_FACTS, EOD_JOBS, PLATFORM_FACTS, pick } from '@/lib/platform';

interface FlowRow {
  domain: string;
  flows: Array<{ name: string; note: { en: string; vi: string } }>;
}

const DOMAIN_FLOWS: FlowRow[] = [
  {
    domain: 'LNM · Loan',
    flows: [
      { name: 'lnm-loan-formation-v2', note: { en: 'Multi-stage formation: maker input → branch appraisal → PGD/GD review → board review → contract.', vi: 'Khởi tạo đa giai đoạn: maker nhập → thẩm định chi nhánh → PGD/GD → hội đồng → hợp đồng.' } },
      { name: 'lnm-disbursement-register-v2 · lnm-disb-batch-register-v2', note: { en: 'Register disbursement (single or batch grouped by plan code).', vi: 'Đăng ký giải ngân (đơn lẻ hoặc theo lô gom nhóm theo mã phương án).' } },
      { name: 'lnm-disbursement-complete-v2 · lnm-disb-batch-complete-v2', note: { en: 'Complete/disburse with per-row guards and a single posting entry.', vi: 'Hoàn tất/giải ngân với guard từng dòng và một bút toán duy nhất.' } },
      { name: 'lnm-collection-v2 · lnm-collection-batch-v2', note: { en: 'Repayment collection, batch variant supports N contracts per case.', vi: 'Thu nợ; bản batch hỗ trợ N hợp đồng trong một hồ sơ.' } },
      { name: 'lnm-debt-change · rate-change · restructure · waiver · writeoff · recovery', note: { en: 'Credit adjustments: debt classification, interest rate, restructuring, waiver, write-off, recovery.', vi: 'Điều chỉnh tín dụng: nhóm nợ, lãi suất, cơ cấu lại, miễn giảm, xóa nợ, thu hồi.' } },
      { name: 'lnm-fund-check · revenue-allocation · vfu-fee-allocation · off-balance-export · mortgage-adjust', note: { en: 'Operational adjustments: fund check, revenue/fee allocation, off-balance export, collateral adjust.', vi: 'Điều chỉnh vận hành: kiểm tra nguồn, phân bổ doanh thu/phí, xuất ngoại bảng, điều chỉnh thế chấp.' } },
      { name: 'lnm-general-provision-v2 · lnm-specific-provision-v1', note: { en: 'Loss provisioning: EOD general provision batch and specific provision case.', vi: 'Trích lập dự phòng: batch chung theo EOD và hồ sơ dự phòng cụ thể.' } },
    ],
  },
  {
    domain: 'FIN · Finance',
    flows: [
      { name: 'fin-single-entry-v2 · fin-double-entry-v2', note: { en: 'Manual single/double-entry postings with posting preview and idempotency key.', vi: 'Hạch toán đơn/kép thủ công kèm xem trước bút toán và idempotency key.' } },
      { name: 'fin-fund-utilization-v2 · fin-fund-appropriation-v2', note: { en: 'Fund utilization and appropriation flows, N lines per case.', vi: 'Luồng sử dụng vốn và phân bổ vốn, N dòng mỗi hồ sơ.' } },
      { name: 'fin-off-balance-v2 · fin-txn-cancel-v2', note: { en: 'Off-balance entries (same-direction lines, nature-B accounts) and transaction cancellation (reversal link + reason).', vi: 'Bút toán ngoại bảng (các dòng cùng chiều, tài khoản nature-B) và hủy giao dịch (liên kết đảo + lý do).' } },
      { name: 'fin-closing-v2', note: { en: 'Period closing case: freeze and carry balances before opening the next period.', vi: 'Hồ sơ khóa sổ kỳ: chốt và kết chuyển số dư trước khi mở kỳ kế tiếp.' } },
    ],
  },
  {
    domain: 'DPM · Deposit',
    flows: [
      { name: 'dpm-product-register-v1 · dpm-product-edit-v1', note: { en: 'Savings/term product registration and edit approvals.', vi: 'Đăng ký và điều chỉnh sản phẩm tiết kiệm/kỳ hạn.' } },
      { name: 'dpm-rate-v1 · dpm-interest-v1', note: { en: 'Interest rate changes and interest parameter adjustments.', vi: 'Thay đổi lãi suất và tham số tính lãi.' } },
      { name: 'dpm-additional-v1 · dpm-settle-v2', note: { en: 'Additional deposit and settlement/withdrawal cases.', vi: 'Nộp thêm và tất toán/rút tiền.' } },
    ],
  },
  {
    domain: 'CRM · HRM · CFC · IBM · RPT',
    flows: [
      { name: 'crm-customer-registration-v2 · customer-adjustment-v2', note: { en: 'Customer onboarding and amendment approval chains.', vi: 'Chuỗi phê duyệt mở khách hàng mới và điều chỉnh thông tin.' } },
      { name: 'hrm-employee-registration-v2', note: { en: 'Employee registration with SLA escalation on pending approvals.', vi: 'Đăng ký nhân sự kèm SLA cảnh báo khi chờ duyệt quá hạn.' } },
      { name: 'cfc-contract-v1 · cfc-amendment-v1 · cfc-movement-v1', note: { en: 'Capital contract, amendment, and fund movement approvals.', vi: 'Phê duyệt hợp đồng vốn, điều chỉnh và luồng quỹ.' } },
      { name: 'ibm-place-v1 · ibm-movement-v1', note: { en: 'Interbank placement and movement cases.', vi: 'Hồ sơ đặt vốn liên ngân hàng và dịch chuyển.' } },
      { name: 'rpt-submit-v2', note: { en: 'Statistical report submission with maker-checker confirmation.', vi: 'Nộp báo cáo thống kê với xác nhận maker-checker.' } },
    ],
  },
];

const CASE_SEQUENCE = `// Domain service → workflow-service (gRPC) → Zeebe
workflowClient.CreateCase(ctx, CaseRequest{
    CaseType:        "LNM_DISBURSEMENT_REGISTER_V2",
    PrimaryObjectID: disbursementID,
    DomainService:   "loan-service",
})
workflowClient.SubmitCase(ctx, caseID, actor, variables)
// → process instance starts; user tasks project into workflow_tasks
// → UI: /workbench claims + completes tasks, domain workers post side effects`;

export default function WorkflowsPage() {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';

  return (
    <DocPage>
      <DocHeader
        badge="RUNBOOKS • ZEEBE"
        badgeTone="warning"
        title={isVi ? 'Quy trình Nghiệp vụ & Vận hành' : 'Banking Workflows & Operations'}
        description={
          isVi
            ? 'Các luồng BPMN chạy dài trên Zeebe 8.5, động cơ khóa sổ cuối ngày (COB), chiếu tác vụ cho workbench và tiêu chuẩn SLA.'
            : 'Long-running BPMN flows on Zeebe 8.5, the End-of-Day (COB) batch engine, workbench task projection, and SLA semantics.'
        }
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard value={PLATFORM_FACTS.bpmnProcesses} label={isVi ? 'Quy trình BPMN' : 'BPMN processes'} hint="deployed by workflow-service" />
        <StatCard value={EOD_JOBS.length} label={isVi ? 'Tác vụ chuỗi COB' : 'COB sequence jobs'} hint="advisory-lock single runner" tone="warning" />
        <StatCard value={PLATFORM_FACTS.services} label={isVi ? 'Domain services' : 'Domain services'} hint="gRPC + NATS side effects" tone="info" />
        <StatCard value={`${AUTH_FACTS.recentAuthWindowSeconds}s`} label={isVi ? 'Cửa sổ recent auth' : 'Recent-auth window'} hint="high-risk routes & EOD" tone="success" />
      </section>

      {/* 1. Domain flows */}
      <DocSection
        index="1"
        icon={Workflow}
        title={isVi ? 'Bản đồ Quy trình theo Nghiệp vụ' : 'Workflow Map by Domain'}
        description={
          isVi
            ? `${PLATFORM_FACTS.bpmnProcesses} quy trình BPMN được nạp kèm service; mỗi hồ sơ là một case type riêng với phân cấp phê duyệt maker-checker.`
            : `All ${PLATFORM_FACTS.bpmnProcesses} BPMN processes ship with the service; each flow is its own case type with maker-checker approval tiers.`
        }
      >
        <div className="space-y-4">
          {DOMAIN_FLOWS.map((group) => (
            <div key={group.domain} className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {group.domain}
              </div>
              <DataTable
                columns={[isVi ? 'Quy trình' : 'Process', isVi ? 'Nghiệp vụ' : 'Business flow']}
                minWidth={640}
                rows={group.flows.map((flow) => [
                  <code key="name" className="font-mono text-[11px] text-primary">
                    {flow.name}
                  </code>,
                  pick(flow.note, locale),
                ])}
              />
            </div>
          ))}
        </div>
      </DocSection>

      {/* 2. Case orchestration */}
      <DocSection
        index="2"
        icon={Layers}
        title={isVi ? 'Khởi tạo Hồ sơ & Ranh giới Zeebe' : 'Case Orchestration & Zeebe Boundary'}
      >
        <CodeBlock title="create-case" code={CASE_SEQUENCE} />
        <Callout tone="info" title={isVi ? 'Vì sao chỉ workflow-service nói chuyện với Zeebe?' : 'Why only workflow-service talks to Zeebe?'}>
          {isVi
            ? 'Gom toàn bộ vòng đời process instance vào một service giúp kiểm soát version BPMN, retry cấu hình, và bảo vệ Zeebe Gateway sau mạng nội bộ.'
            : 'Funneling the process-instance lifecycle through one service keeps BPMN versioning, retry configuration, and Zeebe Gateway exposure under a single boundary.'}
        </Callout>
        <Callout tone="neutral" title={isVi ? 'Hợp đồng phần tử BPMN' : 'BPMN element contract'}>
          {isVi
            ? 'userTask cho bước con người, serviceTask cho side effect nghiệp vụ, throw error + boundary event cho lỗi nghiệp vụ, biến chỉ mang tham chiếu, SLA là timer không ngắt. Chi tiết đầy đủ ở trang Kiến trúc §6.'
            : 'userTask for human steps, serviceTask for domain side effects, thrown errors + boundary events for business failures, reference-only variables, and non-interrupting SLA timers. Full table in Architecture §6.'}
        </Callout>
      </DocSection>

      {/* 3. EOD */}
      <DocSection
        index="3"
        icon={Clock}
        title={isVi ? 'Chuỗi Khóa sổ Cuối ngày (COB)' : 'End-of-Day (COB) Sequence'}
        description={
          isVi
            ? 'Động cơ EOD ở platform-service chạy tuần tự theo sequence dưới khóa advisory của PostgreSQL (bảo đảm chỉ một runner khi có nhiều replica), idempotent theo business_date.'
            : 'The platform-service EOD engine runs steps in sequence order under a PostgreSQL advisory lock (single runner across replicas), idempotent per business_date.'
        }
      >
        <DataTable
          columns={['Seq', 'Job code', isVi ? 'Nghiệp vụ' : 'Task', 'Endpoint']}
          minWidth={720}
          rows={EOD_JOBS.map((job) => [
            <code key="seq" className="font-mono text-[11px] text-primary">
              {job.sequence}
            </code>,
            <code key="code" className="font-mono text-[11px]">
              {job.code}
            </code>,
            pick(job.name, locale),
            <code key="endpoint" className="font-mono text-[11px]">
              {job.endpoint}
            </code>,
          ])}
        />
        <Callout tone="success" icon={CheckCircle2} title={isVi ? 'Bảo đảm vận hành' : 'Operational guarantees'}>
          {isVi
            ? 'Bước đã DONE trong ngày nghiệp vụ sẽ bị SKIPPED_DONE khi chạy lại; job definitions cho phép bật/tắt và chỉnh endpoint/sequence từ màn quản trị.'
            : 'A step already DONE for the business date is reported SKIPPED_DONE on re-run; job definitions can be enabled/disabled and re-sequenced from the admin screen.'}
        </Callout>
      </DocSection>

      {/* 4. Workbench & SLA */}
      <DocSection
        index="4"
        icon={Activity}
        title={isVi ? 'Workbench, Chiếu Tác vụ & SLA' : 'Workbench, Task Projection & SLA'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Callout tone="primary" title={isVi ? 'Chiếu tác vụ' : 'Task projection'}>
            {isVi
              ? 'User task từ Zeebe được chiếu vào workflow_tasks (PostgreSQL) để workbench truy vấn tức thì: claim, complete, candidate users, priority.'
              : 'Zeebe user tasks project into workflow_tasks (PostgreSQL) so the workbench can query instantly: claim, complete, candidate users, priority.'}
          </Callout>
          <Callout tone="warning" title={isVi ? 'SLA' : 'SLA'}>
            {isVi
              ? 'SLA là timer boundary không ngắt trên user task: quá hạn sẽ escalate/cảnh báo chứ không làm fail quy trình; cấu hình SLA được seed theo từng luồng.'
              : 'SLA is a non-interrupting timer boundary on user tasks: overdue work escalates but never fails the process; SLA configs are seeded per flow.'}
          </Callout>
          <Callout tone="info" title={isVi ? 'Màn giám sát' : 'Monitoring screens'}>
            {isVi
              ? 'workflow remote có hub giám sát: instances, incidents, element panel, retry-all, jobs và timeline gộp theo hồ sơ.'
              : 'The workflow remote ships a monitoring hub: instances, incidents, element panel, retry-all, jobs, and a merged case timeline.'}
          </Callout>
          <Callout tone="neutral" title={isVi ? 'Màn điều khiển' : 'Operator controls'}>
            {isVi
              ? 'Khiếm khuyết quy trình có thể chỉnh variables khi instance đang chạy, retry incident và xem job definition mà không cần mở Zeebe Operate.'
              : 'Operators can edit variables on running instances, retry incidents, and inspect job definitions without opening Zeebe Operate.'}
          </Callout>
        </div>
      </DocSection>

      {/* 5. Performance & verification */}
      <DocSection
        index="5"
        icon={Gauge}
        title={isVi ? 'Hiệu năng & Kiểm chứng' : 'Performance & Verification'}
      >
        <Callout tone="danger" title={isVi ? 'Lưu ý kiểm thử tải' : 'Load-test warning'}>
          {isVi
            ? 'arda-perf chạy constant-arrival-rate trực tiếp vào production edge (https://api.arda.io.vn), không ramp. Luôn xác nhận trước khi chạy bất kỳ kịch bản nào.'
            : 'arda-perf runs constant-arrival-rate scenarios straight against the production edge (https://api.arda.io.vn) with no ramp-up. Always confirm before starting a run.'}
        </Callout>
        <Callout tone="success" title={isVi ? 'Kiểm chứng trong CI' : 'CI verification'}>
          {isVi
            ? `CI arda-be chạy ${PLATFORM_FACTS.checkScripts} script invariant, trong đó check-bpmn.mjs xác thực tài nguyên BPMN và check-migrations.mjs kiểm tra migration trước khi workflow mới được deploy.`
            : `The arda-be CI runs ${PLATFORM_FACTS.checkScripts} invariant scripts, including check-bpmn.mjs for BPMN assets and check-migrations.mjs before any new workflow ships.`}
        </Callout>
      </DocSection>

      <DocFooterNav
        previous={{ href: '/api-reference', label: isVi ? 'Xem lại: Cổng API' : 'Previous: API Gateway' }}
        next={{ href: '/problems/auth.error.unauthorized/', label: isVi ? 'Đến: Danh mục Lỗi RFC 7807' : 'Go to: RFC 7807 Problem Catalog' }}
      />
    </DocPage>
  );
}
