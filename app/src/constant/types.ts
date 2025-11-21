export interface Item {
  maloaive: string;
  tenloaive: string;
  giatien: number;
  soluong: number;
  dongia: number;
  thanhtien: number;
}

export interface Order {
  madonhang: string;
  manguoidung: string;
  trangthai: string;
  tongtien: number;
  thoihanthanhtoan: string;
}

export interface Promotion {
  makhuyenmai: string;
  magiamgia?: string;
  loaigiam: "PHAN_TRAM" | "SO_TIEN";
  giatrigiam: number;
  giatritoithieu: number;
}
