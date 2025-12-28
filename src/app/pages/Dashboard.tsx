"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, message, Spin, Statistic, Progress, List, Tag, Typography, Badge } from "antd";
import { api } from "../services/api"; 
import { HomeOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

interface Summary {
  totalHouseholds: number;
  totalPersons: number;
  totalFees: number;
  totalReceivable: number;
  totalCollected: number;
  collectionRate: number;
}

// Interface tin tức
interface NewsItem {
  id: number;
  title: string;
  category: string;
  tagColor: string;
  date: string;
  content: string;
  imageUrl: string;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fm = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await api.get<Summary>("/reports/summary?periodYm=2025-12");
        setData(res.data);
      } catch (err) {
         // Ẩn lỗi nếu chưa có API thật
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // Dữ liệu giả lập đã được BỔ SUNG THÊM ẢNH và tin tức
  const newsData: NewsItem[] = [
    {
      id: 1,
      title: "Khai trương phòng Gym tầng 3",
      category: "Tiện ích",
      tagColor: "blue",
      date: "28/12/2025",
      content: "Phòng Gym Blue Moon Fitness chính thức hoạt động. Giảm 20% phí tập tháng đầu cho cư dân.",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Quy định PCCC mới 2025",
      category: "Pháp luật",
      tagColor: "red",
      date: "27/12/2025",
      content: "Yêu cầu cư dân không để đồ vật cản lối thoát hiểm hành lang. BQL sẽ kiểm tra định kỳ hàng tuần.",
      imageUrl: "https://greenhn.sgp1.digitaloceanspaces.com/attachments/2025/07/5GJeyAWxnNEkYKrT4d4L.jpg"
    },
    {
      id: 3,
      title: "Thông báo cắt nước bảo trì",
      category: "Thông báo",
      tagColor: "orange",
      date: "26/12/2025",
      content: "Tạm ngưng cấp nước từ 9h-11h ngày 30/12 để bảo trì hệ thống bơm áp lực tòa nhà.",
      imageUrl: "https://ctn-cantho.com.vn/assets/news/thongbaocupnuoc-news-thumb.png"
    },
    {
      id: 4,
      title: "Phân luồng giao thông ngã tư sở",
      category: "Khu vực",
      tagColor: "green",
      date: "25/12/2025",
      content: "Sở GTVT điều chỉnh đèn tín hiệu tại ngã tư Nguyễn Trãi để giảm ùn tắc giờ cao điểm.",
      imageUrl: "https://cafefcdn.com/203337114487263232/2023/1/9/photo-16-16732401147111342223785.jpg"
    },
    {
      id: 5,
      title: "Làm thẻ cư dân đợt cuối",
      category: "Hành chính",
      tagColor: "purple",
      date: "24/12/2025",
      content: "BQL nhận hồ sơ làm thẻ cư dân bổ sung đến hết ngày 31/12 tại phòng sinh hoạt chung.",
      imageUrl: "https://vinhomesgrandpark247.com/upload/images/the%20cu%20dan%20vinhomes%20grand%20park(1).jpeg"
    },
    {
      id: 6,
      title: "Ngày hội sống xanh",
      category: "Sự kiện",
      tagColor: "cyan",
      date: "23/12/2025",
      content: "Chương trình đổi pin cũ lấy cây xanh diễn ra tại sảnh A vào chủ nhật tuần này.",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1613&auto=format&fit=crop"
    },
    {
      id: 7,
      title: "Bảo dưỡng thang máy PL01",
      category: "Kỹ thuật",
      tagColor: "geekblue",
      date: "22/12/2025",
      content: "Thang máy số 1 sẽ tạm dừng hoạt động từ 13h-15h ngày mai để thay cáp tải.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvIvaeflJNp2oLqDNvemrlj1TgnxMvHVSU0A&s"
    },
    {
      id: 8,
      title: "Lớp Yoga cộng đồng miễn phí",
      category: "Cộng đồng",
      tagColor: "magenta",
      date: "20/12/2025",
      content: "Mời cư dân tham gia lớp Yoga sáng sớm tại sân thượng tòa B. Bắt đầu từ 5h30 sáng.",
      imageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1469&auto=format&fit=crop"
    }
  ];

  return (
    <Spin spinning={loading}>
      {/* Row 1: Thống kê cơ bản - ĐÃ THÊM MÀU NỀN */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card 
            variant="borderless"
            hoverable
            style={{ 
              background: 'linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%)', // Gradient Xanh biển
              borderRadius: 12,
              boxShadow: '0 4px 15px rgba(91, 134, 229, 0.3)'
            }}
          >
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Tổng số hộ</span>}
              value={data?.totalHouseholds || 120} 
              prefix={<HomeOutlined style={{ color: '#fff', opacity: 0.8 }} />} 
              valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
           variant="borderless"
            hoverable
            style={{ 
              background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)', // Gradient Hồng tím
              borderRadius: 12,
              boxShadow: '0 4px 15px rgba(221, 36, 118, 0.3)'
            }}
          >
             <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Nhân khẩu</span>}
              value={data?.totalPersons || 450} 
              prefix={<UserOutlined style={{ color: '#fff', opacity: 0.8 }} />} 
              valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 32 }}
            />
          </Card>
        </Col>
         <Col span={8}>
          <Card 
            variant="borderless"
            hoverable
            style={{ 
              background: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)', // Gradient Vàng Cam
              borderRadius: 12,
              boxShadow: '0 4px 15px rgba(242, 201, 76, 0.3)'
            }}
          >
             <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Khoản thu dự kiến</span>}
              value={data?.totalFees || 0} 
              precision={0}
              formatter={(value) => fm(Number(value))} // Format tiền tệ
              valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 32 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Thống kê tài chính - ĐÃ CHỈNH LẠI MÀU SẮC */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
         <div style={{ width: 4, height: 24, background: '#1890ff', borderRadius: 2 }}></div>
         <Title level={4} style={{ margin: 0 }}>Tình hình thu phí (Tháng 12/2025)</Title>
      </div>
      
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card 
            variant="borderless"
            style={{ borderRadius: 12, borderTop: '4px solid #1890ff' }} // Viền trên màu xanh
          >
             <Statistic 
                title="Tổng phải thu"
                value={data?.totalReceivable || 0}
                formatter={(value) => fm(Number(value))}
                valueStyle={{ color: '#1890ff', fontWeight: 'bold', fontSize: 28 }}
             />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            variant="borderless"
            style={{ borderRadius: 12, borderTop: '4px solid #52c41a' }} // Viền trên màu xanh lá
          >
             <Statistic 
                title="Đã thu"
                value={data?.totalCollected || 0}
                formatter={(value) => fm(Number(value))}
                valueStyle={{ color: '#52c41a', fontWeight: 'bold', fontSize: 28 }}
             />
          </Card>
        </Col>
        <Col span={8}>
           <Card 
            variant="borderless"
            style={{ borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Progress type="circle" percent={data?.collectionRate || 0} width={80} strokeColor="#52c41a" />
                <div>
                  <div style={{ color: '#8c8c8c' }}>Tiến độ thu</div>
                  <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {data?.collectionRate || 0}%
                  </div>
                </div>
              </div>
           </Card>
        </Col>
      </Row>

      {/* Row 3: Tin tức & Thông báo (Dạng lưới ảnh + text) */}
      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title={<span><BellOutlined style={{ marginRight: 8, color: '#faad14' }} />Tin tức & Sự kiện</span>} 
            variant="borderless"
            bodyStyle={{ padding: '24px' }}
          >
            {/* Đã xóa height và overflow để bỏ thanh cuộn riêng */}
            <div style={{ paddingRight: '0' }}> 
              <List
                grid={{
                  gutter: 24,
                  xs: 1,   // Điện thoại: 1 cột
                  sm: 2,   // Tablet nhỏ: 2 cột
                  md: 3,   // Tablet/Laptop: 3 cột
                  lg: 3,
                  xl: 4,   // Màn hình lớn: 4 cột
                  xxl: 4,
                }}
                dataSource={newsData}
                renderItem={(item) => (
                  <List.Item>
                    {/* Dùng Badge.Ribbon để hiển thị Category ở góc phải ảnh */}
                    <Badge.Ribbon text={item.category} color={item.tagColor}>
                      <Card
                        hoverable
                        style={{ height: '100%', overflow: 'hidden' }}
                        cover={
                          <div style={{ height: 180, overflow: 'hidden' }}>
                            <img 
                              alt={item.title} 
                              src={item.imageUrl} 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                transition: 'transform 0.3s'
                              }} 
                            />
                          </div>
                        }
                        bodyStyle={{ padding: '16px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 180px)' }}
                      >
                        {/* Đã xóa Tag, chỉ giữ lại ngày tháng */}
                        <div style={{ marginBottom: 8 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>📅 {item.date}</Text>
                        </div>

                        {/* Tiêu đề giữ nguyên định dạng cũ */}
                        <div style={{ 
                          fontWeight: 600, 
                          fontSize: 16, 
                          marginBottom: 8, 
                          height: 48, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical' 
                        }}>
                          {item.title}
                        </div>
                        
                        {/* Nội dung giữ nguyên */}
                        <Paragraph 
                          ellipsis={{ rows: 3, expandable: false }} 
                          style={{ color: '#595959', fontSize: 14, marginBottom: 0, flex: 1 }}
                        >
                          {item.content}
                        </Paragraph>
                      </Card>
                    </Badge.Ribbon>
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default Dashboard;