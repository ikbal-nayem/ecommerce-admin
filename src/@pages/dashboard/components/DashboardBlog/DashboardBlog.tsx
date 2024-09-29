import WxButton from "@components/WxButton";
import WxIcon from "@components/WxIcon/WxIcon";
import blogThumbImg from "../../../../assets/images/discover_img/blogThumb.png";

const DashboardBlog = () => {
  return (
    <div className="wx__col-md-4 wx__col-sm-12 wx__mt-3">
      <div className="wx__blog_card wx__card">
      <div className="wx__blog_img">
        <img src={blogThumbImg} alt="" />
      </div>
      <div className="blog_body">
        <span className="wx__text_caption">POSTED ON: 05 APR 2022</span>
        <h6 className="wx__mb-0 wx__mt-2 wx__text_h6 wx__text_semibold">
          Your Website Maintenance Checklist - HostGator Hosted
        </h6>
        <WxButton>
          Read More <WxIcon className="wx__ms-2" icon="arrow_forward" />
        </WxButton>
      </div>
    </div>
    </div>
  );
};

export default DashboardBlog;
