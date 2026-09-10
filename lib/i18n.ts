// lib/i18n.ts
// Internationalization configuration & bilingual dictionary for Arda Documentation

export type SupportedLocale = 'en' | 'vi';

export interface LocaleItem {
  name: string;
  locale: SupportedLocale;
}

export const supportedLocales: LocaleItem[] = [
  { name: 'English', locale: 'en' },
  { name: 'Tiếng Việt', locale: 'vi' },
];

export const defaultLocale: SupportedLocale = 'en';

export const fumadocsViTranslations: Record<string, string> = {
  'Search': 'Tìm kiếm',
  'Search(search dialog)': 'Tìm kiếm tài liệu...',
  'Search(search trigger)': 'Tìm kiếm',
  'No results found(search dialog)': 'Không tìm thấy kết quả',
  'On this page(table of contents)': 'Mục lục',
  'Table of Contents(inline table of contents)': 'Mục lục',
  'No Headings(table of contents)': 'Không có mục lục',
  'Previous Page(pagination)': 'Trang trước',
  'Next Page(pagination)': 'Trang sau',
  'Choose a language(language switcher)': 'Ngôn ngữ',
  'Choose a language(language switcher)(aria-label)': 'Chọn ngôn ngữ',
  'Back to Home(404 not found page)': 'Về trang chủ',
  'Page Not Found(404 not found page)': 'Không tìm thấy trang',
  'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)':
    'Trang này không tồn tại hoặc đã được di chuyển.',
  'Copied Text(code block)(aria-label)': 'Đã sao chép',
  'Copy Text(code block)(aria-label)': 'Sao chép',
  'Copy Markdown(page actions)': 'Sao chép Markdown',
  'Open Search(search trigger)(aria-label)': 'Tìm kiếm',
  'Open Sidebar(aria-label)': 'Mở menu',
  'Close Sidebar(aria-label)': 'Đóng menu',
  'Collapse Sidebar(sidebar)(aria-label)': 'Thu gọn',
  'displayName': 'Tiếng Việt',
};

export const dictionary = {
  en: {
    // Top
    title: 'Arda Documentation',
    subtitle: 'Technical specifications, system invariants, and RFC 7807 error catalog for Arda Core Banking.',
    quickJump: 'Jump to:',

    // Sections
    secCatalog: 'Error Catalog',
    secArchitecture: 'Architecture',
    secApi: 'API Gateway',
    secWorkflows: 'Workflows',

    // Architecture
    archTitle: 'System Architecture & Invariants',
    glTitle: 'Double-Entry Accounting',
    glDesc: 'Balanced journal entries (Debit = Credit) with immutable posting runs and automated trial balance.',
    sagaTitle: 'Zeebe Distributed Sagas',
    sagaDesc: '22 BPMN workflows orchestrating loan formation, disbursement batches, and compensating rollback.',
    tenantTitle: 'Multi-Tenant Isolation',
    tenantDesc: 'Verified tenant scoping via FromOutgoing gRPC metadata. Strict row-level isolation in Postgres.',
    timeTitle: 'Time Normalization',
    timeDesc: 'Timestamps persist in UTC timestamptz. Business dates compute in tenant timezone via ardatime.',

    // API Gateway
    apiTitle: 'API Gateway & Protocol',
    apiDesc: 'All client requests pass through auth-gateway on port 8082. Route policies, authentication, and rate limits are defined declaratively in configs/policy.yaml with OpenAPI 3.1 contracts.',

    // Workflows
    wfTitle: 'Workflows & Operations',
    loanTitle: 'Loan Formation Lifecycle',
    loanDesc: 'Maker input, branch appraisal, committee approval, and automated batch disbursement.',
    eodTitle: 'End of Day (COB) Batches',
    eodDesc: 'Cutoff freeze, deposit interest accrual, loan delinquency aging, and general ledger close.',

    // Problem Catalog Table
    catalogTitle: 'RFC 7807 Problem Catalog',
    searchPlaceholder: 'Filter by code, title, domain, or HTTP status (Press "/" to focus)...',
    filterAll: 'All',
    filterClient: '4xx Client',
    filterServer: '5xx Server',
    colStatus: 'Status',
    colCode: 'Error Code',
    colTitle: 'Summary',
    colDoc: 'Doc',
    showing: 'Showing',
    to: 'to',
    of: 'of',
    results: 'specifications',
    noResults: 'No problem codes match:',

    // Right Rail
    railInspectorTitle: 'Error Inspector',
    clientAction: 'Client Action:',
    operatorAction: 'Operator Action:',
    btnViewDoc: 'View full specification →',
    railGatewayTitle: 'Gateway Reference',
    baseGateway: 'Gateway URL',
    localBff: 'Local Dev BFF',
    contentType: 'Content-Type',
    requestId: 'Request ID Header',
    curlLookup: 'Lookup API',
    copy: 'Copy',
    copied: 'Copied',
  },
  vi: {
    // Top
    title: 'Tài liệu Kỹ thuật Arda',
    subtitle: 'Đặc tả kỹ thuật, các bất biến hệ thống và danh mục mã lỗi RFC 7807 cho Arda Core Banking.',
    quickJump: 'Xem nhanh:',

    // Sections
    secCatalog: 'Danh mục Lỗi',
    secArchitecture: 'Kiến trúc',
    secApi: 'Cổng API',
    secWorkflows: 'Quy trình',

    // Architecture
    archTitle: 'Kiến trúc Hệ thống & Các Bất biến',
    glTitle: 'Sổ cái Kế toán Kép (GL)',
    glDesc: 'Mọi bút toán bắt buộc cân bằng Nợ = Có với các lượt ghi sổ bất biến và tự động đối chiếu cân đối thử.',
    sagaTitle: 'Saga Phân tán Zeebe',
    sagaDesc: '22 quy trình BPMN điều phối khởi tạo khoản vay, gom lô giải ngân và cơ chế bù trừ giao dịch.',
    tenantTitle: 'Cách ly Đa Người thuê',
    tenantDesc: 'Toàn bộ truy vấn gRPC mang metadata FromOutgoing. Cách ly chặt chẽ theo tenant tại Postgres.',
    timeTitle: 'Chuẩn hóa Thời gian',
    timeDesc: 'Dữ liệu lưu dạng timestamptz UTC. Ngày nghiệp vụ tính toán qua ardatime theo múi giờ tenant.',

    // API Gateway
    apiTitle: 'Cổng API & Giao thức',
    apiDesc: 'Mọi request từ client đi qua auth-gateway (cổng 8082). Chính sách định tuyến, xác thực và giới hạn tần suất được khai báo tập trung tại configs/policy.yaml với chuẩn OpenAPI 3.1.',

    // Workflows
    wfTitle: 'Quy trình Nghiệp vụ & Vận hành',
    loanTitle: 'Khởi tạo Khoản vay',
    loanDesc: 'Maker nhập liệu, chi nhánh thẩm định, hội đồng phê duyệt và giải ngân tự động theo lô.',
    eodTitle: 'Khóa sổ Cuối ngày (COB)',
    eodDesc: 'Đóng băng lịch giao dịch, tính dồn tích lãi tiền gửi, phân loại nợ và khóa sổ cái tổng hợp.',

    // Problem Catalog Table
    catalogTitle: 'Danh mục Mã Lỗi RFC 7807',
    searchPlaceholder: 'Tìm theo mã, tên lỗi, phân hệ hoặc HTTP (Nhấn "/" để tìm)...',
    filterAll: 'Tất cả',
    filterClient: '4xx Lỗi Client',
    filterServer: '5xx Lỗi Server',
    colStatus: 'Mã HTTP',
    colCode: 'Mã Lỗi',
    colTitle: 'Tóm tắt',
    colDoc: 'Tài liệu',
    showing: 'Hiển thị',
    to: 'đến',
    of: 'trên tổng số',
    results: 'mã lỗi',
    noResults: 'Không tìm thấy mã lỗi nào khớp với:',

    // Right Rail
    railInspectorTitle: 'Trình soi lỗi RFC 7807',
    clientAction: 'Xử lý phía Client:',
    operatorAction: 'Chẩn đoán Vận hành:',
    btnViewDoc: 'Xem toàn bộ đặc tả →',
    railGatewayTitle: 'Tham chiếu Gateway',
    baseGateway: 'URL Gateway',
    localBff: 'BFF Local',
    contentType: 'Content-Type',
    requestId: 'Header Request ID',
    curlLookup: 'API Tra cứu Máy đọc',
    copy: 'Sao chép',
    copied: 'Đã sao chép',
  },
};
