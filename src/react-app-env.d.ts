/// <reference types="react-scripts"/>

interface ArticleEntities {
  id: number;
  _id: string;
  title: string;
  target: string;
  priority?: number;
  deadline?: string;
  createdAt: string;
  banner: string;
  videoUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  status: boolean | string;
  action: any;
  type: string;
  scope: string;
  tag: string;
  __v?: number;
}

interface RequestedBy {
  _id: string;
  id?: string;
  docUrl: string;
  hkId: string;
  hkIdImage: string;
  paymentUrl: string;
  affilatedBy: string;
  agentLevel: any;
  cashoutType: string;
  codeId: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  myCredit: number;
  name: string;
  password: string;
  phone: string;
  shippingAddress: string;
  stCustomerId: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  additionalAttribute: any;
}
interface ApprovalEntities {
  id: number;
  agentToken: string;
  amountPayable: number;
  _id: string;
  type: string;
  subType: string;
  requestedBy: RequestedBy;
  amount: number;
  affilatedBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  appliedGradeLevel: any;
  currentGradeLevel: any;
  transactionId: string;
  docUrl: string;
  user: any;
  __v?: number;
  additionalAttribute: any;
  name: string;
}

interface ProductEntities {
  id: string;
  _id: string;
  name: string;
  status: boolean | string;
  number: number;
  isActive: boolean;
  imageUrl: string;
  description: string;
  credit: number;
  createdAt: string;
  updatedAt: string;
  itemCode: string;
  customerReward: number;
  agencyReward: number;
  __v?: number;
}
interface ProductAdd {
  name: string;
  description: string;
  photo: string;
  customerReward: number;
  agencyReward: number;
  itemCode: string;
  status: boolean | string;
  isActive: boolean;
}
interface EshopEntities {
  id: string;
  _id: string;
  name: string;
  status: boolean | string;
  number: number;
  status: boolean;
  stock: number;
  imageUrl: string;
  description: string;
  credit: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  type: string;
}

interface UserEntities {
  agentToken: string;
  _id: string;
  hkId: string;
  hkIdImage: string;
  customer_type: string;
  affilatedBy: string;
  agentLevel: any;
  cashoutDetails: any;
  cashoutType: string;
  createdAt: string;
  isActive: boolean;
  isAdmin: boolean;
  isAgent: boolean;
  isCustomer: boolean;
  myCredit: number;
  name: string;
  phone: string;
  shippingAddress: {
    region: string;
    address: string;
  };
  updatedAt: string;
  __v?: number;
}
interface BlackListEntities {
  _id: string;
  phone: string;
  creditedAt: string;
  updatedAt: string;
  __v?: number;
}

interface GradeLevelEntities {
  id: string;
  _id: string;
  name: string;
  description: string;
  status: string;
  deposite: number;
  credit: number;
  maxRequestQty: number;
  isActive: boolean | string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface LegalDetails {
  _id: string;
  details: any;
  type: string;
  __v?: number;
}

interface GiftApprovalList {
  _id: string;
  type: string;
  subType: string;
  requestedBy: {
    _id: string;
    name: string;
    phone: number;
    myCredit: number;
    isAdmin: boolean;
    isActive: boolean;
    password: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    codeId: string;
    stCustomerId: string;
    shippingAddress: string;
    affilatedBy: string;
    additionalAttribute: {
      firstName: string;
      lastName: string;
      docUrl: string;
      paymentUrl: string;
      hkId: string;
    };
    agentLevel: {
      _id: string;
      name: string;
      deposite: number;
      credit: number;
      isActive: boolean;
      maxRequestQty: number;
      createdAt: string;
      updatedAt: string;
      __v?: number;
    };
    cashoutType: stripe;
    isAgent: boolean;
    isCustomer: boolean;
  };
  amount: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  status: string;
}

// interface GiftApproval {
//   _id: string;
//   type: string;
//   subType: string;
//   requestedBy: {
//     _id: string;
//     name: string;
//     phone: number;
//     myCredit: number;
//     isAdmin: boolean;
//     isActive: boolean;
//     password: string;
//     email: string;
//     createdAt: string;
//     updatedAt: string;
//     __v?: number;
//     codeId: string;
//     stCustomerId: string;
//     shippingAddress: string;
//     affilatedBy: string;
//     addtionalAtrribute: {
//       firstName: string;
//       lastName: string;
//       docUrl: string;
//       paymentUrl: string;
//       hkId: string;
//     };
//     cashoutType: string;
//     isAgent: boolean;
//     isCustomer: boolean;
//     agentLevel: string;
//   };
//   status: string;
//   giftId: {
//     _id: string;
//     name: string;
//     credit: number;
//     stock: number;
//     status: string;
//     description: string;
//     imageUrl: string;
//     createdAt: string;
//     updatedAt: string;
//     __v?: number;
//   };
//   cartId: string;
//   __v?: number;
//   createdAt: string;
//   updatedAt: string;
// }

interface GiftApproval {
  _id: string;
  type: string;
  subType: string;
  requestedBy: {
    _id: string;
    phone: string;
    myCredit: number;
    isCustomer: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    stCustomerId: string;
    codeId: string;
    agentLevel: {
      _id: string;
      name: string;
      description: string;
      deposite: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      __v?: number;
      credit: number;
      maxRequestQty: number;
    };
    shippingAddress: any;
    name: string;
    isAgent: boolean;
    isAdmin: boolean;
  };
  status: string;
  giftId: {
    _id: string;
    name: string;
    number: number;
    credit: number;
    stock: number;
    status: boolean;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
  };
  cartId: any;
  __v: number;
  createdAt: string;
  updatedAt: string;
  reason: string;
  shipment: string;
  shippingCode: string;
}

interface Cashout {
  _id: string;
  type: string;
  subType: string;
  paymentMethod: string;
  requestedBy: {
    _id: string;
    name: string;
    phone: string;
    myCredit: number;
    isAdmin: boolean;
    isActive: boolean;
    password: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    codeId: string;
    cashoutDetails: any;
    stCustomerId: string;
    shippingAddress: string;
    affilatedBy: string;
    cashoutType: string;
    isAgent: boolean;
    isCustomer: boolean;
    agentLevel: {
      _id: string;
      name: string;
      deposite: number;
      credit: number;
      isActive: boolean;
      maxRequestQty: number;
      createdAt: string;
      updatedAt: string;
      __v?: number;
    };
    docUrl: string;
    hkId: string;
    additionalAttribute: {
      firstName: string;
      lastName: string;
      docUrl: string;
      paymentUrl: string;
      hkId: string;
    };
  };
  status: string;
  paymentMethod: string;
  amount: {
    value: number;
    credit: number;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface TransmissionEntities {
  _id: string;
  from: string;
  to: string;
  itemId: string;
  transmissionDate: string;
  type: string;
  productName: string;
}
interface TransmissionDetails {
  _id: string;
  from: string;
  to: string;
  itemId: string;
  transmissionDate: string;
  type: string;
  productName: string[];
  isUndo: boolean;
}

interface CompanyAccount {
  _id: string;
  details: any;
  type: string;
  __v?: number;
}

interface CashBank {
  _id: string;
  bankName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
interface CashBankDetails {
  _id: string;
  bankName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface ApproveMonthlyAgentCredit {
  _id: string;
  status: string;
  credit?: number;
}

interface MonthlyAgentCreditDetail {
  _id: string;
  type: string;
  subType: string;
  requestedBy: {
    _id: string;
    phone: string;
    myCredit: number;
    isCustomer: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    stCustomerId: string;
    codeId: string;
    agentLevel: {
      _id: string;
      name: string;
      description: string;
      deposite: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      __v?: number;
      credit: number;
      maxRequestQty: number;
    };
    shippingAddress: string;
    name: string;
    isAgent: boolean;
    isAdmin: boolean;
  };
  status: string;
  credit: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface MonthlyAgentCredit {
  _id: string;
  phone: string;
  myCredit: number;
  isCustomer: boolean;
  isAdmin: boolean;
  isAgent: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  agentLevel: string;
}

interface AgentLevel {
  _id: string;
  name: string;
  hkId: string;
  hkIdImage: string;
  description: string;
  deposite: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  credit: number;
  maxRequestQty: number;
}

interface Admin {
  _id: string;
  email: string;
  isActive: Boolean;
  isAdmin: Boolean;
  myCredit: number;
  name: string;
  password: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface ActiveAgent {
  _id: string;
  name: string;
  phone: string;
}

interface AppAdmin {
  _id: string;
}
interface PushNotification {
  content: string;
  gradeId: string;
  name: string;
  _id: string;
}

interface ProuductItem {
  _id: string;
  itemUUID: string;
  sellable: boolean;
  createdAt: string;
  lastAgent: string;
  productName: string;
  credit: number;
  photo?: string;
  productId?: string;
}
