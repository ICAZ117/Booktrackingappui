import svgPaths from "./svg-fmtjv8vdcy";
import imgImg from "figma:asset/f0bc44e5823d3f7858df2ee67d531ab9d1d1be35.png";
import imgImg1 from "figma:asset/e21b4f0a5f752ad43ab07e61d728ad3d087783e1.png";
import imgImg2 from "figma:asset/4ec7bbd82b2151549688b7b0384bcfd8ec9468b9.png";
import imgImg3 from "figma:asset/92657088c3c8def8c8e4b745bc3dd1c321231df6.png";
import imgImg4 from "figma:asset/03c6248ce3fb6f432db3e5629f10a2f8c6fbca6f.png";
import imgImg5 from "figma:asset/021365c5195433ec0875c2d23f0bc8066c9f5e81.png";
import imgImg6 from "figma:asset/a9ec8fc9207cedc7962476b03ef17a97120c3e71.png";
import imgImg7 from "figma:asset/98e35b5685a4f12960e62ef1d8ae614b590301e9.png";
import imgImg8 from "figma:asset/9ceda1f9ede13b39e80ac51e89c4aca92b145eb1.png";
import imgImg9 from "figma:asset/ddce7bd5c84e7c7983dcb7e4b964531b23acaeae.png";
import imgImg10 from "figma:asset/f4c27f5ef88f9845cc3712dadc0f84445f63e140.png";
import imgImg11 from "figma:asset/fef7475f2ce40a613432243c7921ae2f7db9b574.png";
import imgImg12 from "figma:asset/c558b22db78f80003f72c0afeb396cca12914c1d.png";
import imgImg13 from "figma:asset/1843f7cf9f4afce2dee4896cdea592be57288189.png";
import imgImage22 from "figma:asset/af7f0c3b50d270840904a075fe47bb234c236ab0.png";

function H() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="h1">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#f3f4f6] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">Insights</p>
    </div>
  );
}

function P() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#9ca3af] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Your reading analytics</p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[56px] items-start relative shrink-0 w-full" data-name="Container">
      <H />
      <P />
    </div>
  );
}

function Award() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Award">
      <div className="absolute inset-[53.71%_29.17%_8.34%_29.18%]" data-name="Vector">
        <div className="absolute inset-[-10.98%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9968 11.1095">
            <path d={svgPaths.p3d70580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-1/4 right-1/4 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path d={svgPaths.p31e16900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] relative rounded-[14px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] px-[12px] relative size-full">
        <Award />
      </div>
    </div>
  );
}

function H2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[16px] text-white top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Badge Collection</p>
    </div>
  );
}

function P1() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.8)] top-px whitespace-nowrap">9 / 23 achievements unlocked</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] h-[42px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <H2 />
        <P1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[48px] relative shrink-0 w-[236.273px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container2 />
        <Container3 />
      </div>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ChevronRight">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ChevronRight">
          <path d="M9 18L15 12L9 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Div1() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-center justify-between left-[20px] top-[20px] w-[342px]" data-name="div">
      <Container1 />
      <ChevronRight />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[88px] overflow-clip relative rounded-[16px] shrink-0 w-full" data-name="button" style={{ backgroundImage: "linear-gradient(167.027deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }}>
      <Div1 />
    </div>
  );
}

function BarChart1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="BarChart3">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="BarChart3">
          <path d={svgPaths.p90824c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12 11.3333V6" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8.66667 11.3333V3.33333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 11.3333V9.33333" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Span() {
  return (
    <div className="h-[20px] relative shrink-0 w-[63.672px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[32.5px] not-italic text-[14px] text-center text-white top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Statistics</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] h-[46px] min-h-px min-w-px relative rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1)]" data-name="button" style={{ backgroundImage: "linear-gradient(166.18deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center relative size-full">
        <BarChart1 />
        <Span />
      </div>
    </div>
  );
}

function Users() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Users">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Users">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #D1D5DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #D1D5DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #D1D5DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, #D1D5DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Span1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[53.266px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[27px] not-italic text-[#d1d5db] text-[14px] text-center top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Authors</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#1f2937] flex-[1_0_0] h-[46px] min-h-px min-w-px relative rounded-[14px]" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#374151] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center p-px relative size-full">
        <Users />
        <Span1 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[8px] h-[46px] items-start relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Button3() {
  return (
    <div className="flex-[1_0_0] h-[42px] min-h-px min-w-px relative rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1)]" data-name="button" style={{ backgroundImage: "linear-gradient(161.003deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[60.63px] not-italic text-[14px] text-center text-white top-[11.5px] tracking-[-0.1504px] whitespace-nowrap">This Month</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#1f2937] flex-[1_0_0] h-[42px] min-h-px min-w-px relative rounded-[14px]" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#374151] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[61.47px] not-italic text-[#d1d5db] text-[14px] text-center top-[11.5px] tracking-[-0.1504px] whitespace-nowrap">2026</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#1f2937] flex-[1_0_0] h-[42px] min-h-px min-w-px relative rounded-[14px]" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#374151] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[61.23px] not-italic text-[#d1d5db] text-[14px] text-center top-[11.5px] tracking-[-0.1504px] whitespace-nowrap">All Time</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pr-[0.008px] relative size-full">
        <Button3 />
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Calendar">
      <div className="absolute bottom-3/4 left-[33.33%] right-[66.67%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 1V5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[66.67%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 1V5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p371e6400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_12.5%_58.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-1px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 2">
            <path d="M1 1H19" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] relative rounded-[14px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] px-[12px] relative size-full">
        <Calendar />
      </div>
    </div>
  );
}

function H3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[16px] text-white top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">February 2026 Wrap-Up</p>
    </div>
  );
}

function P2() {
  return (
    <div className="h-[16px] opacity-90 relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px whitespace-nowrap">View shareable monthly summary</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="flex-[1_0_0] h-[42px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <H3 />
        <P2 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[48px] relative shrink-0 w-[258.469px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function ChevronRight1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ChevronRight">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ChevronRight" opacity="0.8">
          <path d="M9 18L15 12L9 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-center justify-between left-[20px] top-[20px] w-[342px]" data-name="div">
      <Container7 />
      <ChevronRight1 />
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[88px] overflow-clip relative rounded-[16px] shrink-0 w-full" data-name="button" style={{ backgroundImage: "linear-gradient(167.027deg, rgb(0, 211, 243) 0%, rgb(81, 162, 255) 50%, rgb(194, 122, 255) 100%)" }}>
      <Div2 />
    </div>
  );
}

function BookOpen() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="BookOpen">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="BookOpen">
          <path d="M14 8.16667V24.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p3a72eb00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[27.66px] rounded-[16777200px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 107, 107) 0%, rgb(238, 90, 111) 100%)" }}>
      <BookOpen />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[32px] left-0 top-[72px] w-[119.328px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-[59.74px] not-italic text-[#101828] text-[24px] text-center top-0 tracking-[0.0703px] whitespace-nowrap">8</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[16px] left-0 top-[106px] w-[119.328px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[59.41px] not-italic text-[#4a5565] text-[12px] text-center top-px whitespace-nowrap">Books Read</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[122px] left-0 top-0 w-[119.328px]" data-name="Container">
      <Container12 />
      <Container13 />
      <Container14 />
    </div>
  );
}

function Star() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Star">
          <path d={svgPaths.paec6a40} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[27.66px] rounded-[16777200px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 165, 0) 0%, rgb(255, 140, 66) 100%)" }}>
      <Star />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[32px] left-0 top-[72px] w-[119.336px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-[60px] not-italic text-[#101828] text-[24px] text-center top-0 tracking-[0.0703px] whitespace-nowrap">3.50</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute h-[16px] left-0 top-[106px] w-[119.336px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[60.05px] not-italic text-[#4a5565] text-[12px] text-center top-px whitespace-nowrap">Average Rating</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[122px] left-[131.33px] top-0 w-[119.336px]" data-name="Container">
      <Container16 />
      <Container17 />
      <Container18 />
    </div>
  );
}

function Target() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Target">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Target">
          <path d={svgPaths.p1fa66600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p190dabf0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p2a9abe70} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[27.66px] rounded-[16777200px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(167, 139, 250) 0%, rgb(139, 92, 246) 100%)" }}>
      <Target />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[32px] left-0 top-[72px] w-[119.336px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-[60.38px] not-italic text-[#101828] text-[24px] text-center top-0 tracking-[0.0703px] whitespace-nowrap">44</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute h-[16px] left-0 top-[106px] w-[119.336px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[60.13px] not-italic text-[#4a5565] text-[12px] text-center top-px whitespace-nowrap">Books Left</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute h-[122px] left-[262.66px] top-0 w-[119.336px]" data-name="Container">
      <Container20 />
      <Container21 />
      <Container22 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[122px] relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Container15 />
      <Container19 />
    </div>
  );
}

function H4() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[144.898px]" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Your</p>
    </div>
  );
}

function H1() {
  return (
    <div className="absolute h-[32px] left-0 top-[22px] w-[144.898px]" data-name="h2">
      <p className="absolute bg-clip-text font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-[transparent] top-0 tracking-[0.0703px] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(90deg, rgb(10, 10, 10) 0%, rgb(10, 10, 10) 100%), linear-gradient(168.187deg, rgb(255, 107, 107) 0%, rgb(255, 165, 0) 100%)" }}>
        Reading goal
      </p>
    </div>
  );
}

function P3() {
  return (
    <div className="absolute h-[16px] left-0 top-[58px] w-[144.898px]" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px whitespace-nowrap">progress 📖</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[74px] relative shrink-0 w-[144.898px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <H4 />
        <H1 />
        <P3 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[74px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pr-[187.102px] relative size-full">
          <Container25 />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute h-[72px] left-0 top-0 w-[117.836px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[72px] left-[58.91px] not-italic text-[#0a0a0a] text-[72px] text-center top-[1.5px] tracking-[0.123px] whitespace-nowrap">📚</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[40px] left-0 top-[80px] w-[117.836px]" data-name="Container">
      <p className="-translate-x-1/2 absolute bg-clip-text font-['Inter:Bold',sans-serif] font-bold leading-[40px] left-[59.5px] not-italic text-[36px] text-[transparent] text-center top-[0.5px] tracking-[0.3691px] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(90deg, rgb(10, 10, 10) 0%, rgb(10, 10, 10) 100%), linear-gradient(162.255deg, rgb(255, 107, 107) 0%, rgb(255, 165, 0) 100%)" }}>
        8 of 52
      </p>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute h-[20px] left-0 top-[124px] w-[117.836px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[58.64px] not-italic text-[#4a5565] text-[14px] text-center top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Books finished</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[144px] relative shrink-0 w-[117.836px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container28 />
        <Container29 />
        <Container30 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[192px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[0.008px] relative size-full">
          <Container27 />
        </div>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-white h-[324px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-px pt-[25px] px-[25px] relative size-full">
        <Container24 />
        <Container26 />
      </div>
    </div>
  );
}

function H5() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute bg-clip-text font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[20px] text-[transparent] top-0 tracking-[-0.4492px] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(90deg, rgb(10, 10, 10) 0%, rgb(10, 10, 10) 100%), linear-gradient(116.565deg, rgb(255, 107, 107) 0%, rgb(255, 165, 0) 100%)" }}>
        8
      </p>
    </div>
  );
}

function P4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">books so far this year 📖</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[48px] items-start left-[21px] top-[21px] w-[340px]" data-name="Container">
      <H5 />
      <P4 />
    </div>
  );
}

function Span2() {
  return (
    <div className="h-[15px] relative shrink-0 w-[17.086px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Jan</p>
      </div>
    </div>
  );
}

function Span3() {
  return (
    <div className="h-[15px] relative shrink-0 w-[17.93px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Feb</p>
      </div>
    </div>
  );
}

function Span4() {
  return (
    <div className="h-[15px] relative shrink-0 w-[18.422px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Mar</p>
      </div>
    </div>
  );
}

function Span5() {
  return (
    <div className="h-[15px] relative shrink-0 w-[17.008px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Apr</p>
      </div>
    </div>
  );
}

function Span6() {
  return (
    <div className="h-[15px] relative shrink-0 w-[19.844px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">May</p>
      </div>
    </div>
  );
}

function Span7() {
  return (
    <div className="h-[15px] relative shrink-0 w-[17.406px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Jun</p>
      </div>
    </div>
  );
}

function Span8() {
  return (
    <div className="h-[15px] relative shrink-0 w-[14.102px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Jul</p>
      </div>
    </div>
  );
}

function Span9() {
  return (
    <div className="h-[15px] relative shrink-0 w-[18.781px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Aug</p>
      </div>
    </div>
  );
}

function Span10() {
  return (
    <div className="h-[15px] relative shrink-0 w-[18.547px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Sep</p>
      </div>
    </div>
  );
}

function Span11() {
  return (
    <div className="h-[15px] relative shrink-0 w-[17.398px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Oct</p>
      </div>
    </div>
  );
}

function Span12() {
  return (
    <div className="h-[15px] relative shrink-0 w-[18.906px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Nov</p>
      </div>
    </div>
  );
}

function Span13() {
  return (
    <div className="h-[15px] relative shrink-0 w-[18.93px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Dec</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start justify-between left-[21px] top-[209px] w-[340px]" data-name="Container">
      <Span2 />
      <Span3 />
      <Span4 />
      <Span5 />
      <Span6 />
      <Span7 />
      <Span8 />
      <Span9 />
      <Span10 />
      <Span11 />
      <Span12 />
      <Span13 />
    </div>
  );
}

function Sparkles() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Sparkles">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_121_6137)" id="Sparkles">
          <path d={svgPaths.p874e300} id="Vector" stroke="var(--stroke-0, #FB64B6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 2V4.66667" id="Vector_2" stroke="var(--stroke-0, #FB64B6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.6667 3.33333H12" id="Vector_3" stroke="var(--stroke-0, #FB64B6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 11.3333V12.6667" id="Vector_4" stroke="var(--stroke-0, #FB64B6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M3.33333 12H2" id="Vector_5" stroke="var(--stroke-0, #FB64B6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_121_6137">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function H6() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="h4">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#f6339a] text-[12px] top-px whitespace-nowrap">📖 Reader insight</p>
    </div>
  );
}

function P5() {
  return (
    <div className="h-[39px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#4a5565] text-[12px] top-[0.5px] w-[304px]">{`Keep it going! At your current pace, you're on track to meet your 2026 reading goal in December.`}</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[59px] items-start left-[24px] top-0 w-[316px]" data-name="Container">
      <H6 />
      <P5 />
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[59px] relative shrink-0 w-full" data-name="Container">
      <Sparkles />
      <Container36 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex flex-col h-[76px] items-start left-[21px] pt-[17px] top-[244px] w-[340px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t inset-0 pointer-events-none" />
      <Container35 />
    </div>
  );
}

function Img() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg} />
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[13.5px] left-[29.83px] top-[102.5px] w-[4.344px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">1</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute h-[96px] left-0 top-0 w-[64px]" data-name="Container">
      <Container40 />
      <Container41 />
    </div>
  );
}

function Img1() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg1} />
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img1 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute h-[13.5px] left-[29.2px] top-[102.5px] w-[5.602px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">2</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute h-[96px] left-[72px] top-0 w-[64px]" data-name="Container">
      <Container43 />
      <Container44 />
    </div>
  );
}

function Img2() {
  return <div className="h-[92px] shrink-0 w-full" data-name="img" />;
}

function Container46() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img2 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute h-[13.5px] left-[29.09px] top-[102.5px] w-[5.813px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">3</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute h-[96px] left-[144px] top-0 w-[64px]" data-name="Container">
      <Container46 />
      <Container47 />
    </div>
  );
}

function Img3() {
  return <div className="h-[92px] shrink-0 w-full" data-name="img" />;
}

function Container49() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img3 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute h-[13.5px] left-[29.02px] top-[102.5px] w-[5.961px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">4</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute h-[96px] left-[216px] top-0 w-[64px]" data-name="Container">
      <Container49 />
      <Container50 />
    </div>
  );
}

function Img4() {
  return <div className="h-[92px] shrink-0 w-full" data-name="img" />;
}

function Container52() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img4 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute h-[13.5px] left-[29.13px] top-[102.5px] w-[5.734px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">5</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute h-[96px] left-[288px] top-0 w-[64px]" data-name="Container">
      <Container52 />
      <Container53 />
    </div>
  );
}

function Img5() {
  return <div className="h-[92px] shrink-0 w-full" data-name="img" />;
}

function Container55() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img5 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container56() {
  return (
    <div className="absolute h-[13.5px] left-[29.05px] top-[102.5px] w-[5.898px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">6</p>
    </div>
  );
}

function Container54() {
  return (
    <div className="absolute h-[96px] left-[360px] top-0 w-[64px]" data-name="Container">
      <Container55 />
      <Container56 />
    </div>
  );
}

function Img6() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg2} />
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img6 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute h-[13.5px] left-[29.35px] top-[102.5px] w-[5.297px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">7</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="absolute h-[96px] left-[432px] top-0 w-[64px]" data-name="Container">
      <Container58 />
      <Container59 />
    </div>
  );
}

function Img7() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg3} />
    </div>
  );
}

function Container61() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img7 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute h-[13.5px] left-[29.04px] top-[102.5px] w-[5.922px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">8</p>
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute h-[96px] left-[504px] top-0 w-[64px]" data-name="Container">
      <Container61 />
      <Container62 />
    </div>
  );
}

function Img8() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg4} />
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img8 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container65() {
  return (
    <div className="absolute h-[13.5px] left-[29.05px] top-[102.5px] w-[5.898px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">9</p>
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute h-[96px] left-[576px] top-0 w-[64px]" data-name="Container">
      <Container64 />
      <Container65 />
    </div>
  );
}

function Img9() {
  return <div className="h-[92px] shrink-0 w-full" data-name="img" />;
}

function Container67() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img9 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container68() {
  return (
    <div className="absolute h-[13.5px] left-[26.91px] top-[102.5px] w-[10.18px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">10</p>
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute h-[96px] left-[648px] top-0 w-[64px]" data-name="Container">
      <Container67 />
      <Container68 />
    </div>
  );
}

function Img10() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg5} />
    </div>
  );
}

function Container70() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img10 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute h-[13.5px] left-[27.66px] top-[102.5px] w-[8.688px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">11</p>
    </div>
  );
}

function Container69() {
  return (
    <div className="absolute h-[96px] left-[720px] top-0 w-[64px]" data-name="Container">
      <Container70 />
      <Container71 />
    </div>
  );
}

function Img11() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg6} />
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img11 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container74() {
  return (
    <div className="absolute h-[13.5px] left-[27.03px] top-[102.5px] w-[9.945px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">12</p>
    </div>
  );
}

function Container72() {
  return (
    <div className="absolute h-[96px] left-[792px] top-0 w-[64px]" data-name="Container">
      <Container73 />
      <Container74 />
    </div>
  );
}

function Img12() {
  return <div className="h-[92px] shrink-0 w-full" data-name="img" />;
}

function Container76() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img12 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container77() {
  return (
    <div className="absolute h-[13.5px] left-[26.92px] top-[102.5px] w-[10.156px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">13</p>
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute h-[96px] left-[864px] top-0 w-[64px]" data-name="Container">
      <Container76 />
      <Container77 />
    </div>
  );
}

function Img13() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg7} />
    </div>
  );
}

function Container79() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img13 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container80() {
  return (
    <div className="absolute h-[13.5px] left-[26.85px] top-[102.5px] w-[10.305px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">14</p>
    </div>
  );
}

function Container78() {
  return (
    <div className="absolute h-[96px] left-[936px] top-0 w-[64px]" data-name="Container">
      <Container79 />
      <Container80 />
    </div>
  );
}

function Img14() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg8} />
    </div>
  );
}

function Container82() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img14 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container83() {
  return (
    <div className="absolute h-[13.5px] left-[26.96px] top-[102.5px] w-[10.078px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">15</p>
    </div>
  );
}

function Container81() {
  return (
    <div className="absolute h-[96px] left-[1008px] top-0 w-[64px]" data-name="Container">
      <Container82 />
      <Container83 />
    </div>
  );
}

function Img15() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg9} />
    </div>
  );
}

function Container85() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img15 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute h-[13.5px] left-[26.88px] top-[102.5px] w-[10.242px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">16</p>
    </div>
  );
}

function Container84() {
  return (
    <div className="absolute h-[96px] left-[1080px] top-0 w-[64px]" data-name="Container">
      <Container85 />
      <Container86 />
    </div>
  );
}

function Img16() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg10} />
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img16 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container89() {
  return (
    <div className="absolute h-[13.5px] left-[27.18px] top-[102.5px] w-[9.633px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">17</p>
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute h-[96px] left-[1152px] top-0 w-[64px]" data-name="Container">
      <Container88 />
      <Container89 />
    </div>
  );
}

function Img17() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg11} />
    </div>
  );
}

function Container91() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img17 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute h-[13.5px] left-[26.87px] top-[102.5px] w-[10.258px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">18</p>
    </div>
  );
}

function Container90() {
  return (
    <div className="absolute h-[96px] left-[1224px] top-0 w-[64px]" data-name="Container">
      <Container91 />
      <Container92 />
    </div>
  );
}

function Img18() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg12} />
    </div>
  );
}

function Container94() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img18 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container95() {
  return (
    <div className="absolute h-[13.5px] left-[26.88px] top-[102.5px] w-[10.242px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">19</p>
    </div>
  );
}

function Container93() {
  return (
    <div className="absolute h-[96px] left-[1296px] top-0 w-[64px]" data-name="Container">
      <Container94 />
      <Container95 />
    </div>
  );
}

function Img19() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg13} />
    </div>
  );
}

function Container97() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img19 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container98() {
  return (
    <div className="absolute h-[13.5px] left-[26.28px] top-[102.5px] w-[11.438px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">20</p>
    </div>
  );
}

function Container96() {
  return (
    <div className="absolute h-[96px] left-[1368px] top-0 w-[64px]" data-name="Container">
      <Container97 />
      <Container98 />
    </div>
  );
}

function Img20() {
  return <div className="h-[92px] shrink-0 w-full" data-name="img" />;
}

function Container100() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img20 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container101() {
  return (
    <div className="absolute h-[13.5px] left-[27.03px] top-[102.5px] w-[9.945px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">21</p>
    </div>
  );
}

function Container99() {
  return (
    <div className="absolute h-[96px] left-[1440px] top-0 w-[64px]" data-name="Container">
      <Container100 />
      <Container101 />
    </div>
  );
}

function Img21() {
  return <div className="h-[92px] shrink-0 w-full" data-name="img" />;
}

function Container103() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[96px] left-0 rounded-[10px] top-0 w-[64px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Img21 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container104() {
  return (
    <div className="absolute h-[13.5px] left-[26.4px] top-[102.5px] w-[11.203px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[#99a1af] text-[9px] top-[0.5px] tracking-[0.167px] whitespace-nowrap">22</p>
    </div>
  );
}

function Container102() {
  return (
    <div className="absolute h-[96px] left-[1512px] top-0 w-[64px]" data-name="Container">
      <Container103 />
      <Container104 />
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[96px] relative shrink-0 w-full" data-name="Container">
      <Container39 />
      <Container42 />
      <Container45 />
      <Container48 />
      <Container51 />
      <Container54 />
      <Container57 />
      <Container60 />
      <Container63 />
      <Container66 />
      <Container69 />
      <Container72 />
      <Container75 />
      <Container78 />
      <Container81 />
      <Container84 />
      <Container87 />
      <Container90 />
      <Container93 />
      <Container96 />
      <Container99 />
      <Container102 />
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex flex-col h-[104px] items-start left-[21px] overflow-clip pr-[-1236px] pt-[-12px] top-[81px] w-[340px]" data-name="Container">
      <Container38 />
    </div>
  );
}

function Container31() {
  return (
    <div className="bg-white h-[341px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Container32 />
      <Container33 />
      <Container34 />
      <Container37 />
    </div>
  );
}

function H7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">📅 Reading Streaks</p>
    </div>
  );
}

function Container107() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px whitespace-nowrap">Best reading streak</p>
    </div>
  );
}

function Container108() {
  return (
    <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="bg-clip-text flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[36px] min-h-px min-w-px not-italic relative text-[30px] text-[transparent] tracking-[0.3955px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(10, 10, 10) 0%, rgb(10, 10, 10) 100%), linear-gradient(173.29deg, rgb(255, 107, 107) 0%, rgb(255, 165, 0) 100%)" }}>
        2
      </p>
    </div>
  );
}

function Container109() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">days in a row this year 🔥</p>
    </div>
  );
}

function Container106() {
  return (
    <div className="h-[118px] relative rounded-[14px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(160.86deg, rgb(253, 242, 248) 0%, rgb(255, 241, 242) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#fce7f3] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Container107 />
        <Container108 />
        <Container109 />
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="absolute h-[28px] left-0 rounded-[16777200px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-0 w-[45.188px]" data-name="Container" style={{ backgroundImage: "linear-gradient(148.216deg, rgb(255, 107, 107) 0%, rgb(255, 165, 0) 100%)" }}>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[12px] not-italic text-[12px] text-white top-[7px] whitespace-nowrap">Jan</p>
    </div>
  );
}

function Container112() {
  return (
    <div className="absolute h-[28px] left-[53.19px] rounded-[16777200px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-0 w-[45.828px]" data-name="Container" style={{ backgroundImage: "linear-gradient(148.576deg, rgb(255, 107, 107) 0%, rgb(255, 165, 0) 100%)" }}>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[12px] not-italic text-[12px] text-white top-[7px] whitespace-nowrap">Feb</p>
    </div>
  );
}

function Container113() {
  return (
    <div className="absolute h-[28px] left-[107.02px] rounded-[16777200px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-0 w-[46.68px]" data-name="Container" style={{ backgroundImage: "linear-gradient(149.043deg, rgb(255, 107, 107) 0%, rgb(255, 165, 0) 100%)" }}>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[12px] not-italic text-[12px] text-white top-[7px] whitespace-nowrap">Mar</p>
    </div>
  );
}

function Container110() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <Container111 />
      <Container112 />
      <Container113 />
    </div>
  );
}

function H8() {
  return (
    <div className="absolute h-[16px] left-0 top-0 w-[340px]" data-name="h4">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px whitespace-nowrap">February 2026</p>
    </div>
  );
}

function Container116() {
  return (
    <div className="absolute h-[15px] left-0 top-0 w-[45.141px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[22.7px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">S</p>
    </div>
  );
}

function Container117() {
  return (
    <div className="absolute h-[15px] left-[49.14px] top-0 w-[45.141px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[23.03px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">M</p>
    </div>
  );
}

function Container118() {
  return (
    <div className="absolute h-[15px] left-[98.28px] top-0 w-[45.141px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[22.75px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">T</p>
    </div>
  );
}

function Container119() {
  return (
    <div className="absolute h-[15px] left-[147.42px] top-0 w-[45.148px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[23.03px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">W</p>
    </div>
  );
}

function Container120() {
  return (
    <div className="absolute h-[15px] left-[196.57px] top-0 w-[45.141px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[22.75px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">T</p>
    </div>
  );
}

function Container121() {
  return (
    <div className="absolute h-[15px] left-[245.71px] top-0 w-[45.141px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[22.56px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">F</p>
    </div>
  );
}

function Container122() {
  return (
    <div className="absolute h-[15px] left-[294.85px] top-0 w-[45.141px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[22.7px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">S</p>
    </div>
  );
}

function Container115() {
  return (
    <div className="absolute h-[15px] left-0 top-[28px] w-[340px]" data-name="Container">
      <Container116 />
      <Container117 />
      <Container118 />
      <Container119 />
      <Container120 />
      <Container121 />
      <Container122 />
    </div>
  );
}

function Container125() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">1</p>
    </div>
  );
}

function Container124() {
  return (
    <div className="absolute bg-[#f9fafb] left-0 rounded-[10px] size-[45.141px] top-0" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[37.836px] pt-[3px] relative rounded-[inherit] size-full">
        <Container125 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container127() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">2</p>
    </div>
  );
}

function Container126() {
  return (
    <div className="absolute bg-[#f9fafb] left-[49.14px] rounded-[10px] size-[45.141px] top-0" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[36.789px] pt-[3px] relative rounded-[inherit] size-full">
        <Container127 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container129() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">3</p>
    </div>
  );
}

function Container128() {
  return (
    <div className="absolute bg-[#f9fafb] left-[98.28px] rounded-[10px] size-[45.141px] top-0" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[36.578px] pt-[3px] relative rounded-[inherit] size-full">
        <Container129 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Img22() {
  return (
    <div className="absolute left-[4px] rounded-[4px] size-[35.148px] top-[4px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgImg13} />
    </div>
  );
}

function Container131() {
  return (
    <div className="absolute h-[12px] left-[2px] top-[2px] w-[5.703px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">4</p>
    </div>
  );
}

function Container130() {
  return (
    <div className="absolute bg-[#fce7f3] border border-[#fbcfe8] border-solid left-[147.42px] overflow-clip rounded-[10px] size-[45.148px] top-0" data-name="Container">
      <Img22 />
      <Container131 />
    </div>
  );
}

function Container133() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">5</p>
    </div>
  );
}

function Container132() {
  return (
    <div className="absolute bg-[#f9fafb] left-[196.57px] rounded-[10px] size-[45.141px] top-0" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[36.625px] pt-[3px] relative rounded-[inherit] size-full">
        <Container133 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Img23() {
  return (
    <div className="absolute left-[4px] rounded-[4px] size-[35.141px] top-[4px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgImg4} />
    </div>
  );
}

function Container135() {
  return (
    <div className="absolute h-[12px] left-[2px] top-[2px] w-[5.68px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">6</p>
    </div>
  );
}

function Container134() {
  return (
    <div className="absolute bg-[#fce7f3] border border-[#fbcfe8] border-solid left-[245.71px] overflow-clip rounded-[10px] size-[45.141px] top-0" data-name="Container">
      <Img23 />
      <Container135 />
    </div>
  );
}

function Container137() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">7</p>
    </div>
  );
}

function Container136() {
  return (
    <div className="absolute bg-[#f9fafb] left-[294.85px] rounded-[10px] size-[45.141px] top-0" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[37.094px] pt-[3px] relative rounded-[inherit] size-full">
        <Container137 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container139() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">8</p>
    </div>
  );
}

function Container138() {
  return (
    <div className="absolute bg-[#f9fafb] left-0 rounded-[10px] size-[45.141px] top-[49.15px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[36.383px] pt-[3px] relative rounded-[inherit] size-full">
        <Container139 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Img24() {
  return <div className="absolute left-[4px] rounded-[4px] size-[35.141px] top-[4px]" data-name="img" />;
}

function Container141() {
  return (
    <div className="absolute h-[12px] left-[2px] top-[2px] w-[5.68px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">9</p>
    </div>
  );
}

function Container140() {
  return (
    <div className="absolute bg-[#fce7f3] border border-[#fbcfe8] border-solid left-[49.14px] overflow-clip rounded-[10px] size-[45.141px] top-[49.15px]" data-name="Container">
      <Img24 />
      <Container141 />
    </div>
  );
}

function Container143() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">10</p>
    </div>
  );
}

function Container142() {
  return (
    <div className="absolute bg-[#f9fafb] left-[98.28px] rounded-[10px] size-[45.141px] top-[49.15px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[32.156px] pt-[3px] relative rounded-[inherit] size-full">
        <Container143 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container145() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">11</p>
    </div>
  );
}

function Container144() {
  return (
    <div className="absolute bg-[#f9fafb] left-[147.42px] rounded-[10px] size-[45.148px] top-[49.15px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[33.547px] pt-[3px] relative rounded-[inherit] size-full">
        <Container145 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container147() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">12</p>
    </div>
  );
}

function Container146() {
  return (
    <div className="absolute bg-[#f9fafb] left-[196.57px] rounded-[10px] size-[45.141px] top-[49.15px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[32.484px] pt-[3px] relative rounded-[inherit] size-full">
        <Container147 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Img25() {
  return (
    <div className="absolute left-[4px] rounded-[4px] size-[35.141px] top-[4px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgImg8} />
    </div>
  );
}

function Container149() {
  return (
    <div className="absolute h-[12px] left-[2px] top-[2px] w-[9.859px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">13</p>
    </div>
  );
}

function Container148() {
  return (
    <div className="absolute bg-[#fce7f3] border border-[#fbcfe8] border-solid left-[245.71px] overflow-clip rounded-[10px] size-[45.141px] top-[49.15px]" data-name="Container">
      <Img25 />
      <Container149 />
    </div>
  );
}

function Container151() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">14</p>
    </div>
  );
}

function Container150() {
  return (
    <div className="absolute bg-[#f9fafb] left-[294.85px] rounded-[10px] size-[45.141px] top-[49.15px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[32.133px] pt-[3px] relative rounded-[inherit] size-full">
        <Container151 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container153() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">15</p>
    </div>
  );
}

function Container152() {
  return (
    <div className="absolute bg-[#f9fafb] left-0 rounded-[10px] size-[45.141px] top-[98.3px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[32.32px] pt-[3px] relative rounded-[inherit] size-full">
        <Container153 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container155() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">16</p>
    </div>
  );
}

function Container154() {
  return (
    <div className="absolute bg-[#f9fafb] left-[49.14px] rounded-[10px] size-[45.141px] top-[98.3px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[32.164px] pt-[3px] relative rounded-[inherit] size-full">
        <Container155 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container157() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">17</p>
    </div>
  );
}

function Container156() {
  return (
    <div className="absolute bg-[#f9fafb] left-[98.28px] rounded-[10px] size-[45.141px] top-[98.3px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[32.797px] pt-[3px] relative rounded-[inherit] size-full">
        <Container157 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Img26() {
  return <div className="absolute left-[4px] rounded-[4px] size-[35.148px] top-[4px]" data-name="img" />;
}

function Container159() {
  return (
    <div className="absolute bg-[#f6339a] h-[10.5px] left-[24.4px] rounded-[4px] top-[30.65px] w-[16.75px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[10.5px] left-[4px] not-italic text-[7px] text-white top-0 tracking-[0.2301px] whitespace-nowrap">+1</p>
    </div>
  );
}

function Container160() {
  return (
    <div className="absolute h-[12px] left-[2px] top-[2px] w-[10.063px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">18</p>
    </div>
  );
}

function Container158() {
  return (
    <div className="absolute bg-[#fce7f3] border border-[#fbcfe8] border-solid left-[147.42px] overflow-clip rounded-[10px] size-[45.148px] top-[98.3px]" data-name="Container">
      <Img26 />
      <Container159 />
      <Container160 />
    </div>
  );
}

function Container162() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">19</p>
    </div>
  );
}

function Container161() {
  return (
    <div className="absolute bg-[#f9fafb] left-[196.57px] rounded-[10px] size-[45.141px] top-[98.3px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[32.164px] pt-[3px] relative rounded-[inherit] size-full">
        <Container162 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container164() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">20</p>
    </div>
  );
}

function Container163() {
  return (
    <div className="absolute bg-[#f9fafb] left-[245.71px] rounded-[10px] size-[45.141px] top-[98.3px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[31.102px] pt-[3px] relative rounded-[inherit] size-full">
        <Container164 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container166() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">21</p>
    </div>
  );
}

function Container165() {
  return (
    <div className="absolute bg-[#f9fafb] left-[294.85px] rounded-[10px] size-[45.141px] top-[98.3px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[32.484px] pt-[3px] relative rounded-[inherit] size-full">
        <Container166 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Img27() {
  return <div className="absolute left-[4px] rounded-[4px] size-[35.141px] top-[4px]" data-name="img" />;
}

function Container168() {
  return (
    <div className="absolute h-[12px] left-[2px] top-[2px] w-[10.703px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">22</p>
    </div>
  );
}

function Container167() {
  return (
    <div className="absolute bg-[#fce7f3] border border-[#fbcfe8] border-solid left-0 overflow-clip rounded-[10px] size-[45.141px] top-[147.45px]" data-name="Container">
      <Img27 />
      <Container168 />
    </div>
  );
}

function Container170() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">23</p>
    </div>
  );
}

function Container169() {
  return (
    <div className="absolute bg-[#f9fafb] left-[49.14px] rounded-[10px] size-[45.141px] top-[147.45px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[31.227px] pt-[3px] relative rounded-[inherit] size-full">
        <Container170 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container172() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">24</p>
    </div>
  );
}

function Container171() {
  return (
    <div className="absolute bg-[#f9fafb] left-[98.28px] rounded-[10px] size-[45.141px] top-[147.45px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[31.141px] pt-[3px] relative rounded-[inherit] size-full">
        <Container172 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container174() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">25</p>
    </div>
  );
}

function Container173() {
  return (
    <div className="absolute bg-[#f9fafb] left-[147.42px] rounded-[10px] size-[45.148px] top-[147.45px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[31.281px] pt-[3px] relative rounded-[inherit] size-full">
        <Container174 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Img28() {
  return (
    <div className="absolute left-[4px] rounded-[4px] size-[35.141px] top-[4px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgImg1} />
    </div>
  );
}

function Container176() {
  return (
    <div className="absolute h-[12px] left-[2px] top-[2px] w-[11.031px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">26</p>
    </div>
  );
}

function Container175() {
  return (
    <div className="absolute bg-[#fce7f3] border border-[#fbcfe8] border-solid left-[196.57px] overflow-clip rounded-[10px] size-[45.141px] top-[147.45px]" data-name="Container">
      <Img28 />
      <Container176 />
    </div>
  );
}

function Container178() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">27</p>
    </div>
  );
}

function Container177() {
  return (
    <div className="absolute bg-[#f9fafb] left-[245.71px] rounded-[10px] size-[45.141px] top-[147.45px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[31.742px] pt-[3px] relative rounded-[inherit] size-full">
        <Container178 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container180() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[#6a7282] text-[8px] top-[0.5px] tracking-[0.2057px] whitespace-nowrap">28</p>
    </div>
  );
}

function Container179() {
  return (
    <div className="absolute bg-[#f9fafb] left-[294.85px] rounded-[10px] size-[45.141px] top-[147.45px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pl-[3px] pr-[31.031px] pt-[3px] relative rounded-[inherit] size-full">
        <Container180 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container123() {
  return (
    <div className="absolute h-[192.594px] left-0 top-[51px] w-[340px]" data-name="Container">
      <Container124 />
      <Container126 />
      <Container128 />
      <Container130 />
      <Container132 />
      <Container134 />
      <Container136 />
      <Container138 />
      <Container140 />
      <Container142 />
      <Container144 />
      <Container146 />
      <Container148 />
      <Container150 />
      <Container152 />
      <Container154 />
      <Container156 />
      <Container158 />
      <Container161 />
      <Container163 />
      <Container165 />
      <Container167 />
      <Container169 />
      <Container171 />
      <Container173 />
      <Container175 />
      <Container177 />
      <Container179 />
    </div>
  );
}

function Container114() {
  return (
    <div className="h-[243.594px] relative shrink-0 w-full" data-name="Container">
      <H8 />
      <Container115 />
      <Container123 />
    </div>
  );
}

function Container183() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute bg-clip-text font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[41.69px] not-italic text-[18px] text-[transparent] text-center top-0 tracking-[-0.4395px] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(90deg, rgb(10, 10, 10) 0%, rgb(10, 10, 10) 100%), linear-gradient(113.199deg, rgb(255, 107, 107) 0%, rgb(255, 165, 0) 100%)" }}>
        2
      </p>
    </div>
  );
}

function Container184() {
  return (
    <div className="h-[13.328px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.333px] left-[41.5px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Best 2026 streak</p>
    </div>
  );
}

function Container182() {
  return (
    <div className="h-[41.328px] relative shrink-0 w-[82.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container183 />
        <Container184 />
      </div>
    </div>
  );
}

function Container186() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[24.08px] not-italic text-[#101828] text-[18px] text-center top-0 tracking-[-0.4395px] whitespace-nowrap">21</p>
    </div>
  );
}

function Container187() {
  return (
    <div className="h-[13.328px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.333px] left-[24.5px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Days read</p>
    </div>
  );
}

function Container185() {
  return (
    <div className="h-[41.328px] relative shrink-0 w-[48.008px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container186 />
        <Container187 />
      </div>
    </div>
  );
}

function Container189() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[26.7px] not-italic text-[#99a1af] text-[18px] text-center top-0 tracking-[-0.4395px] whitespace-nowrap">344</p>
    </div>
  );
}

function Container190() {
  return (
    <div className="h-[13.328px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.333px] left-[26.5px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">No reading</p>
    </div>
  );
}

function Container188() {
  return (
    <div className="h-[41.328px] relative shrink-0 w-[52.75px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container189 />
        <Container190 />
      </div>
    </div>
  );
}

function Container181() {
  return (
    <div className="h-[54.328px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start justify-between pr-[0.008px] pt-[13px] relative size-full">
        <Container182 />
        <Container185 />
        <Container188 />
      </div>
    </div>
  );
}

function Span14() {
  return (
    <div className="h-[20px] relative shrink-0 w-[14px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#fb64b6] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">✨</p>
      </div>
    </div>
  );
}

function H9() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="h4">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#f6339a] text-[12px] top-px whitespace-nowrap">📖 Reader insight</p>
    </div>
  );
}

function P6() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#4a5565] text-[12px] top-[0.5px] whitespace-nowrap">{`Nice! You're currently on your longest reading streak!`}</p>
    </div>
  );
}

function Container193() {
  return (
    <div className="h-[39.5px] relative shrink-0 w-[301.273px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <H9 />
        <P6 />
      </div>
    </div>
  );
}

function Container192() {
  return (
    <div className="content-stretch flex gap-[8px] h-[39.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Span14 />
      <Container193 />
    </div>
  );
}

function Container191() {
  return (
    <div className="content-stretch flex flex-col h-[56.5px] items-start pt-[17px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t inset-0 pointer-events-none" />
      <Container192 />
    </div>
  );
}

function Container105() {
  return (
    <div className="bg-white h-[642.422px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-px pt-[21px] px-[21px] relative size-full">
        <H7 />
        <Container106 />
        <Container110 />
        <Container114 />
        <Container181 />
        <Container191 />
      </div>
    </div>
  );
}

function H10() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px whitespace-nowrap">{`📄 Pages I've Read`}</p>
    </div>
  );
}

function P7() {
  return (
    <div className="absolute h-[16.25px] left-0 top-0 w-[348px]" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.25px] left-0 not-italic text-[#4a5565] text-[10px] top-0 tracking-[0.1172px] whitespace-nowrap">🏗️ Start your reading journey!</p>
    </div>
  );
}

function Container196() {
  return (
    <div className="absolute content-stretch flex h-[36px] items-start left-0 top-[24.25px] w-[348px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[36px] min-h-px min-w-px not-italic relative text-[#101828] text-[30px] tracking-[0.3955px]">3,198</p>
    </div>
  );
}

function Container197() {
  return (
    <div className="absolute h-[15px] left-0 top-[64.25px] w-[348px]" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[#6a7282] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">pages this year</p>
    </div>
  );
}

function Container195() {
  return (
    <div className="h-[79.25px] relative shrink-0 w-full" data-name="Container">
      <P7 />
      <Container196 />
      <Container197 />
    </div>
  );
}

function Container199() {
  return <div className="bg-gradient-to-r from-[#ff6b6b] h-[8px] rounded-[16777200px] shrink-0 to-[orange] w-full" data-name="Container" />;
}

function Container198() {
  return (
    <div className="bg-[#f3f4f6] h-[8px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[273.813px] relative size-full">
          <Container199 />
        </div>
      </div>
    </div>
  );
}

function Container194() {
  return (
    <div className="bg-white h-[161.25px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <H10 />
        <Container195 />
        <Container198 />
      </div>
    </div>
  );
}

function H11() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#f3f4f6] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Star Rating Distribution</p>
    </div>
  );
}

function Span15() {
  return (
    <div className="h-[16px] relative shrink-0 w-[48px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">5⭐</p>
      </div>
    </div>
  );
}

function Container204() {
  return <div className="h-[12px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(173.333deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }} />;
}

function Container203() {
  return (
    <div className="bg-[#374151] flex-[1_0_0] h-[12px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[157.336px] relative size-full">
          <Container204 />
        </div>
      </div>
    </div>
  );
}

function Span16() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[32.86px] not-italic text-[#f3f4f6] text-[12px] text-right top-px whitespace-nowrap">1</p>
      </div>
    </div>
  );
}

function Container202() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Span15 />
      <Container203 />
      <Span16 />
    </div>
  );
}

function Span17() {
  return (
    <div className="h-[16px] relative shrink-0 w-[48px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">4⭐</p>
      </div>
    </div>
  );
}

function Container207() {
  return <div className="h-[12px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(176.214deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }} />;
}

function Container206() {
  return (
    <div className="bg-[#374151] flex-[1_0_0] h-[12px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[78.672px] relative size-full">
          <Container207 />
        </div>
      </div>
    </div>
  );
}

function Span18() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[32.28px] not-italic text-[#f3f4f6] text-[12px] text-right top-px whitespace-nowrap">2</p>
      </div>
    </div>
  );
}

function Container205() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Span17 />
      <Container206 />
      <Span18 />
    </div>
  );
}

function Span19() {
  return (
    <div className="h-[16px] relative shrink-0 w-[48px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">3⭐</p>
      </div>
    </div>
  );
}

function Container209() {
  return <div className="h-[12px] rounded-[16777200px] shrink-0 w-[236px]" data-name="Container" style={{ backgroundImage: "linear-gradient(177.089deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%), linear-gradient(90deg, rgb(55, 65, 81) 0%, rgb(55, 65, 81) 100%)" }} />;
}

function Span20() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[32.97px] not-italic text-[#f3f4f6] text-[12px] text-right top-px whitespace-nowrap">3</p>
      </div>
    </div>
  );
}

function Container208() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Span19 />
      <Container209 />
      <Span20 />
    </div>
  );
}

function Span21() {
  return (
    <div className="h-[16px] relative shrink-0 w-[48px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">2⭐</p>
      </div>
    </div>
  );
}

function Container212() {
  return <div className="h-[12px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(173.333deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }} />;
}

function Container211() {
  return (
    <div className="bg-[#374151] flex-[1_0_0] h-[12px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[157.336px] relative size-full">
          <Container212 />
        </div>
      </div>
    </div>
  );
}

function Span22() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[32.86px] not-italic text-[#f3f4f6] text-[12px] text-right top-px whitespace-nowrap">1</p>
      </div>
    </div>
  );
}

function Container210() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Span21 />
      <Container211 />
      <Span22 />
    </div>
  );
}

function Span23() {
  return (
    <div className="h-[16px] relative shrink-0 w-[48px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">1⭐</p>
      </div>
    </div>
  );
}

function Container215() {
  return <div className="h-[12px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(173.333deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }} />;
}

function Container214() {
  return (
    <div className="bg-[#374151] flex-[1_0_0] h-[12px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[157.336px] relative size-full">
          <Container215 />
        </div>
      </div>
    </div>
  );
}

function Span24() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[32.86px] not-italic text-[#f3f4f6] text-[12px] text-right top-px whitespace-nowrap">1</p>
      </div>
    </div>
  );
}

function Container213() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Span23 />
      <Container214 />
      <Span24 />
    </div>
  );
}

function Container201() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[128px] items-start relative shrink-0 w-full" data-name="Container">
      <Container202 />
      <Container205 />
      <Container208 />
      <Container210 />
      <Container213 />
    </div>
  );
}

function Container200() {
  return (
    <div className="bg-[#1f2937] h-[212px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#374151] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-px pt-[21px] px-[21px] relative size-full">
        <H11 />
        <Container201 />
      </div>
    </div>
  );
}

function H12() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Pages per Day</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[86.41%_78.33%_8.14%_19.61%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_78.33%_8.14%_19.61%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">2</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[86.41%_72.34%_8.14%_25.6%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_72.34%_8.14%_25.6%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">4</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[86.41%_66.35%_8.14%_31.6%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_66.35%_8.14%_31.6%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">6</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[86.41%_60.35%_8.14%_37.59%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_60.35%_8.14%_37.59%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">8</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[86.41%_53.77%_8.14%_42.99%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_53.77%_8.14%_42.99%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">10</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[86.41%_47.78%_8.14%_48.98%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_47.78%_8.14%_48.98%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">12</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[86.41%_41.64%_8.14%_54.83%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_41.64%_8.14%_54.83%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">14</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[86.41%_35.8%_8.14%_60.96%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_35.8%_8.14%_60.96%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">16</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[86.41%_29.81%_8.14%_66.96%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_29.81%_8.14%_66.96%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">18</p>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[86.41%_23.52%_8.14%_72.65%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_23.52%_8.14%_72.65%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">20</p>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[86.41%_17.53%_8.14%_78.64%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_17.53%_8.14%_78.64%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">22</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[86.41%_11.54%_8.14%_84.64%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_11.54%_8.14%_84.64%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">24</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[86.41%_5.55%_8.14%_90.63%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_5.55%_8.14%_90.63%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">26</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[86.41%_-0.05%_8.14%_96.23%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[86.41%_-0.05%_8.14%_96.23%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">28</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[86.41%_-0.05%_8.14%_19.61%]" data-name="Group">
      <Group2 />
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
      <Group10 />
      <Group11 />
      <Group12 />
      <Group13 />
      <Group14 />
      <Group15 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[84.09%_-0.05%_8.14%_17.65%]" data-name="Group">
      <div className="absolute inset-[84.09%_1.47%_15.91%_17.65%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 275 1">
            <path d="M0 0.5H275" id="Vector" stroke="var(--stroke-0, #E5E7EB)" />
          </svg>
        </div>
      </div>
      <Group1 />
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents inset-[81.16%_84.71%_13.39%_13.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[81.16%_84.71%_13.39%_13.24%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-right whitespace-nowrap">0</p>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents inset-[60.7%_84.71%_33.84%_13.82%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[60.7%_84.71%_33.84%_13.82%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-right whitespace-nowrap">1</p>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents inset-[40.25%_84.71%_54.3%_13.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[40.25%_84.71%_54.3%_13.24%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-right whitespace-nowrap">2</p>
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents inset-[19.8%_84.71%_74.75%_13.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[19.8%_84.71%_74.75%_13.24%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-right whitespace-nowrap">3</p>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents inset-[0.48%_84.71%_94.07%_13.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[0.48%_84.71%_94.07%_13.24%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-right whitespace-nowrap">4</p>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents inset-[0.48%_84.71%_13.39%_13.24%]" data-name="Group">
      <Group18 />
      <Group19 />
      <Group20 />
      <Group21 />
      <Group22 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-[0.48%_82.35%_13.39%_13.24%]" data-name="Group">
      <div className="absolute inset-[2.27%_82.35%_15.91%_17.65%]" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 180">
            <path d="M0.5 0V180" id="Vector" stroke="var(--stroke-0, #E5E7EB)" />
          </svg>
        </div>
      </div>
      <Group17 />
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute inset-[84.09%_1.47%_15.91%_17.65%]" data-name="Group">
      <div className="absolute inset-[-1.5px_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 275 3">
          <g id="Group">
            <path d={svgPaths.p35471898} id="Vector" stroke="var(--stroke-0, #3298FF)" strokeWidth="3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute h-[220px] left-0 overflow-clip top-0 w-[340px]" data-name="Icon">
      <Group />
      <Group16 />
      <Group23 />
    </div>
  );
}

function LineChart() {
  return (
    <div className="h-[220px] relative shrink-0 w-full" data-name="LineChart">
      <Icon />
    </div>
  );
}

function Container216() {
  return (
    <div className="bg-white h-[298px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-px pt-[21px] px-[21px] relative size-full">
        <H12 />
        <LineChart />
      </div>
    </div>
  );
}

function Clock() {
  return (
    <div className="absolute left-[17px] size-[16px] top-[17px]" data-name="Clock">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_121_6127)" id="Clock">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_121_6127">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container219() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[41px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Avg. Time to Finish</p>
    </div>
  );
}

function Container220() {
  return (
    <div className="absolute h-[32px] left-[17px] top-[61px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#101828] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">5d</p>
    </div>
  );
}

function Container218() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Clock />
      <Container219 />
      <Container220 />
    </div>
  );
}

function BookOpen1() {
  return (
    <div className="absolute left-[17px] size-[16px] top-[17px]" data-name="BookOpen">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="BookOpen">
          <path d="M8 4.66667V14" id="Vector" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p8c8fb00} id="Vector_2" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container222() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[41px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Avg. Book Length</p>
    </div>
  );
}

function Container223() {
  return (
    <div className="absolute h-[32px] left-[17px] top-[61px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#101828] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">400p</p>
    </div>
  );
}

function Container221() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <BookOpen1 />
      <Container222 />
      <Container223 />
    </div>
  );
}

function Container217() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[110px] relative shrink-0 w-full" data-name="Container">
      <Container218 />
      <Container221 />
    </div>
  );
}

function Flame() {
  return (
    <div className="absolute left-[17px] size-[20px] top-[17px]" data-name="Flame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Flame">
          <path d={svgPaths.p92a8700} id="Vector" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container226() {
  return (
    <div className="absolute h-[32px] left-[17px] top-[45px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#101828] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">0</p>
    </div>
  );
}

function Container227() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[79px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Day Streak 🔥</p>
    </div>
  );
}

function Container225() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(148.809deg, rgb(255, 247, 237) 0%, rgb(254, 242, 242) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#ffedd4] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Flame />
      <Container226 />
      <Container227 />
    </div>
  );
}

function Award1() {
  return (
    <div className="absolute left-[17px] size-[20px] top-[17px]" data-name="Award">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Award">
          <path d={svgPaths.p164f7540} id="Vector" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p809b580} id="Vector_2" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container229() {
  return (
    <div className="absolute h-[32px] left-[17px] top-[45px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#101828] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">0p</p>
    </div>
  );
}

function Container230() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[79px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Longest Day</p>
    </div>
  );
}

function Container228() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(148.809deg, rgb(255, 251, 235) 0%, rgb(254, 252, 232) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#fef3c6] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Award1 />
      <Container229 />
      <Container230 />
    </div>
  );
}

function Headphones() {
  return (
    <div className="absolute left-[17px] size-[20px] top-[17px]" data-name="Headphones">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Headphones">
          <path d={svgPaths.pfa37fa0} id="Vector" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container232() {
  return (
    <div className="absolute h-[32px] left-[17px] top-[45px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#101828] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">0h</p>
    </div>
  );
}

function Container233() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[79px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Audio Time</p>
    </div>
  );
}

function Container231() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[14px] row-2 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(148.809deg, rgb(250, 245, 255) 0%, rgb(253, 244, 255) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#f3e8ff] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Headphones />
      <Container232 />
      <Container233 />
    </div>
  );
}

function TrendingUp() {
  return (
    <div className="absolute left-[17px] size-[20px] top-[17px]" data-name="TrendingUp">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="TrendingUp">
          <path d={svgPaths.p3c797180} id="Vector" stroke="var(--stroke-0, #00BC7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3ac0b600} id="Vector_2" stroke="var(--stroke-0, #00BC7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container235() {
  return (
    <div className="absolute h-[32px] left-[17px] top-[45px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#101828] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">0</p>
    </div>
  );
}

function Container236() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[79px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Pages/Day Avg</p>
    </div>
  );
}

function Container234() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[14px] row-2 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(148.809deg, rgb(236, 253, 245) 0%, rgb(240, 253, 250) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#d0fae5] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <TrendingUp />
      <Container235 />
      <Container236 />
    </div>
  );
}

function Container224() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(2,minmax(0,1fr))] h-[236px] relative shrink-0 w-full" data-name="Container">
      <Container225 />
      <Container228 />
      <Container231 />
      <Container234 />
    </div>
  );
}

function H13() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Detailed Stats</p>
    </div>
  );
}

function Clock1() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[13px]" data-name="Clock">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_121_6127)" id="Clock">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_121_6127">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container240() {
  return (
    <div className="absolute h-[16px] left-[13px] top-[33px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Daily Avg Time</p>
    </div>
  );
}

function Container241() {
  return (
    <div className="absolute h-[28px] left-[13px] top-[51px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">0m</p>
    </div>
  );
}

function Container239() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[10px] row-1 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(151.294deg, rgb(239, 246, 255) 0%, rgb(236, 254, 255) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#dbeafe] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Clock1 />
      <Container240 />
      <Container241 />
    </div>
  );
}

function Target1() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[13px]" data-name="Target">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_121_6029)" id="Target">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #615FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p245eb100} id="Vector_2" stroke="var(--stroke-0, #615FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p18635ff0} id="Vector_3" stroke="var(--stroke-0, #615FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_121_6029">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container243() {
  return (
    <div className="absolute h-[16px] left-[13px] top-[33px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Total Pages</p>
    </div>
  );
}

function Container244() {
  return (
    <div className="absolute h-[28px] left-[13px] top-[51px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">3.2K</p>
    </div>
  );
}

function Container242() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[10px] row-1 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(151.294deg, rgb(238, 242, 255) 0%, rgb(250, 245, 255) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#e0e7ff] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Target1 />
      <Container243 />
      <Container244 />
    </div>
  );
}

function Star1() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[13px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Star">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FF2056)" id="Vector" stroke="var(--stroke-0, #FF2056)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container246() {
  return (
    <div className="absolute h-[16px] left-[13px] top-[33px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">5-Star Books</p>
    </div>
  );
}

function Container247() {
  return (
    <div className="absolute h-[28px] left-[13px] top-[51px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">1</p>
    </div>
  );
}

function Container245() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[10px] row-2 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(151.294deg, rgb(255, 241, 242) 0%, rgb(253, 242, 248) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#ffe4e6] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Star1 />
      <Container246 />
      <Container247 />
    </div>
  );
}

function Users1() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[13px]" data-name="Users">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Users">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #8E51FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #8E51FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #8E51FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, #8E51FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container249() {
  return (
    <div className="absolute h-[16px] left-[13px] top-[33px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Authors</p>
    </div>
  );
}

function Container250() {
  return (
    <div className="absolute h-[28px] left-[13px] top-[51px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">17</p>
    </div>
  );
}

function Container248() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[10px] row-2 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(151.294deg, rgb(245, 243, 255) 0%, rgb(250, 245, 255) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#ede9fe] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Users1 />
      <Container249 />
      <Container250 />
    </div>
  );
}

function Award2() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[13px]" data-name="Award">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Award">
          <path d={svgPaths.p95d9c00} id="Vector" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p27180a80} id="Vector_2" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container252() {
  return (
    <div className="absolute h-[16px] left-[13px] top-[33px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Badges Earned</p>
    </div>
  );
}

function Container253() {
  return (
    <div className="absolute h-[28px] left-[13px] top-[51px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">9 / 23</p>
    </div>
  );
}

function Container251() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[10px] row-3 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(151.294deg, rgb(240, 253, 244) 0%, rgb(236, 253, 245) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#dcfce7] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Award2 />
      <Container252 />
      <Container253 />
    </div>
  );
}

function Coffee() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[13px]" data-name="Coffee">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Coffee">
          <path d="M6.66667 1.33333V2.66667" id="Vector" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 1.33333V2.66667" id="Vector_2" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p11caa380} id="Vector_3" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 1.33333V2.66667" id="Vector_4" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container255() {
  return (
    <div className="absolute h-[16px] left-[13px] top-[33px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Reading Days</p>
    </div>
  );
}

function Container256() {
  return (
    <div className="absolute h-[28px] left-[13px] top-[51px] w-[142px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">0</p>
    </div>
  );
}

function Container254() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[10px] row-3 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(151.294deg, rgb(255, 247, 237) 0%, rgb(255, 251, 235) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#ffedd4] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Coffee />
      <Container255 />
      <Container256 />
    </div>
  );
}

function Container238() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(3,minmax(0,1fr))] h-[300px] relative shrink-0 w-full" data-name="Container">
      <Container239 />
      <Container242 />
      <Container245 />
      <Container248 />
      <Container251 />
      <Container254 />
    </div>
  );
}

function Container237() {
  return (
    <div className="bg-white h-[370px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <H13 />
        <Container238 />
      </div>
    </div>
  );
}

function H14() {
  return (
    <div className="absolute h-[20px] left-[21px] top-[21px] w-[340px]" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Format Breakdown</p>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute inset-[10%_26.47%]" data-name="Group">
      <div className="absolute inset-[-0.31%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 161 161">
          <g id="Group">
            <path d={svgPaths.p3b1f2f80} fill="var(--fill-0, #6B7280)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute inset-[50.87%_26.48%_20.99%_60.12%]" data-name="Group">
      <div className="absolute inset-[-0.92%_-1.14%_-1.26%_-1.55%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46.7575 57.509">
          <g id="Group">
            <path d={svgPaths.p3ef08180} fill="var(--fill-0, #6B7280)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute contents inset-[10%_26.47%]" data-name="Group">
      <Group25 />
      <Group26 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute h-[200px] left-0 overflow-clip top-0 w-[340px]" data-name="Icon">
      <Group24 />
    </div>
  );
}

function PieChart() {
  return (
    <div className="absolute h-[200px] left-[21px] top-[57px] w-[340px]" data-name="PieChart">
      <Icon1 />
    </div>
  );
}

function Container260() {
  return <div className="bg-[#6b7280] rounded-[16777200px] shrink-0 size-[12px]" data-name="Container" />;
}

function Span25() {
  return (
    <div className="h-[16px] relative shrink-0 w-[56.719px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px whitespace-nowrap">hardcover</p>
      </div>
    </div>
  );
}

function Span26() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[7.258px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px whitespace-nowrap">7</p>
      </div>
    </div>
  );
}

function Container259() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[4px] items-center justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container260 />
      <Span25 />
      <Span26 />
    </div>
  );
}

function Container262() {
  return <div className="bg-[#6b7280] rounded-[16777200px] shrink-0 size-[12px]" data-name="Container" />;
}

function Span27() {
  return (
    <div className="h-[16px] relative shrink-0 w-[34.633px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px whitespace-nowrap">digital</p>
      </div>
    </div>
  );
}

function Span28() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[6.141px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px whitespace-nowrap">1</p>
      </div>
    </div>
  );
}

function Container261() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[4px] items-center justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container262 />
      <Span27 />
      <Span28 />
    </div>
  );
}

function Container258() {
  return (
    <div className="absolute gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[52px] left-[21px] pr-[116px] top-[269px] w-[340px]" data-name="Container">
      <Container259 />
      <Container261 />
    </div>
  );
}

function Container257() {
  return (
    <div className="bg-white h-[342px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <H14 />
      <PieChart />
      <Container258 />
    </div>
  );
}

function H15() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Reading Pace Records</p>
    </div>
  );
}

function Zap() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[13px]" data-name="Zap">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Zap">
          <path d={svgPaths.p1d59db00} id="Vector" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container266() {
  return (
    <div className="absolute h-[16px] left-[13px] top-[33px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Fastest Book</p>
    </div>
  );
}

function Container267() {
  return (
    <div className="absolute h-[28px] left-[13px] top-[53px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">3d</p>
    </div>
  );
}

function Container268() {
  return (
    <div className="absolute h-[15px] left-[13px] overflow-clip top-[83px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6a7282] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Look Closer</p>
    </div>
  );
}

function Container265() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[10px] row-1 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(145.909deg, rgb(240, 253, 244) 0%, rgb(236, 253, 245) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#dcfce7] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Zap />
      <Container266 />
      <Container267 />
      <Container268 />
    </div>
  );
}

function Clock2() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[13px]" data-name="Clock">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_121_6084)" id="Clock">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_121_6084">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container270() {
  return (
    <div className="absolute h-[16px] left-[13px] top-[33px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Slowest Book</p>
    </div>
  );
}

function Container271() {
  return (
    <div className="absolute h-[28px] left-[13px] top-[53px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">14d</p>
    </div>
  );
}

function Container272() {
  return (
    <div className="absolute h-[15px] left-[13px] overflow-clip top-[83px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6a7282] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Iron Flame</p>
    </div>
  );
}

function Container269() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[10px] row-1 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(145.909deg, rgb(248, 250, 252) 0%, rgb(249, 250, 251) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Clock2 />
      <Container270 />
      <Container271 />
      <Container272 />
    </div>
  );
}

function BookOpen2() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[13px]" data-name="BookOpen">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="BookOpen">
          <path d="M8 4.66667V14" id="Vector" stroke="var(--stroke-0, #00A6F4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p8c8fb00} id="Vector_2" stroke="var(--stroke-0, #00A6F4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container274() {
  return (
    <div className="absolute h-[16px] left-[13px] top-[33px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Shortest Book</p>
    </div>
  );
}

function Container275() {
  return (
    <div className="absolute h-[28px] left-[13px] top-[53px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">219p</p>
    </div>
  );
}

function Container276() {
  return (
    <div className="absolute h-[15px] left-[13px] overflow-clip top-[83px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6a7282] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Gone Before Goodbye</p>
    </div>
  );
}

function Container273() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[10px] row-2 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(145.909deg, rgb(240, 249, 255) 0%, rgb(239, 246, 255) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#dff2fe] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <BookOpen2 />
      <Container274 />
      <Container275 />
      <Container276 />
    </div>
  );
}

function Book() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[13px]" data-name="Book">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Book">
          <path d={svgPaths.p19d1d100} id="Vector" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container278() {
  return (
    <div className="absolute h-[16px] left-[13px] top-[33px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Longest Book</p>
    </div>
  );
}

function Container279() {
  return (
    <div className="absolute h-[28px] left-[13px] top-[53px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#3298ff] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">640p</p>
    </div>
  );
}

function Container280() {
  return (
    <div className="absolute h-[15px] left-[13px] overflow-clip top-[83px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6a7282] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Iron Flame</p>
    </div>
  );
}

function Container277() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[10px] row-2 self-stretch shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(145.909deg, rgb(250, 245, 255) 0%, rgb(253, 244, 255) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#f3e8ff] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Book />
      <Container278 />
      <Container279 />
      <Container280 />
    </div>
  );
}

function Container264() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(2,minmax(0,1fr))] h-[234px] relative shrink-0 w-full" data-name="Container">
      <Container265 />
      <Container269 />
      <Container273 />
      <Container277 />
    </div>
  );
}

function Container263() {
  return (
    <div className="bg-white h-[312px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-px pt-[21px] px-[21px] relative size-full">
        <H15 />
        <Container264 />
      </div>
    </div>
  );
}

function H16() {
  return (
    <div className="absolute h-[20px] left-[21px] top-[21px] w-[340px]" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Fiction vs Non-Fiction</p>
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute inset-[10%_26.47%]" data-name="Group">
      <div className="absolute inset-[-0.31%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 161 161">
          <g id="Group">
            <path d={svgPaths.p2cb358d0} fill="var(--fill-0, #3298FF)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute contents inset-[10%_26.47%]" data-name="Group">
      <Group28 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute h-[200px] left-0 overflow-clip top-0 w-[340px]" data-name="Icon">
      <Group27 />
    </div>
  );
}

function PieChart1() {
  return (
    <div className="absolute h-[200px] left-[21px] top-[57px] w-[340px]" data-name="PieChart">
      <Icon2 />
    </div>
  );
}

function Container285() {
  return <div className="bg-[#3298ff] rounded-[16777200px] shrink-0 size-[12px]" data-name="Container" />;
}

function Span29() {
  return (
    <div className="h-[16px] relative shrink-0 w-[39.086px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[20.5px] not-italic text-[#364153] text-[12px] text-center top-px whitespace-nowrap">Fiction</p>
      </div>
    </div>
  );
}

function Container284() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center justify-center left-0 pr-[0.008px] top-0 w-[162px]" data-name="Container">
      <Container285 />
      <Span29 />
    </div>
  );
}

function Container286() {
  return (
    <div className="absolute h-[32px] left-0 top-[20px] w-[162px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-[81.08px] not-italic text-[#101828] text-[24px] text-center top-0 tracking-[0.0703px] whitespace-nowrap">8</p>
    </div>
  );
}

function Container287() {
  return (
    <div className="absolute h-[15px] left-0 top-[52px] w-[162px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[80.52px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">100%</p>
    </div>
  );
}

function Container283() {
  return (
    <div className="col-1 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container284 />
      <Container286 />
      <Container287 />
    </div>
  );
}

function Container290() {
  return <div className="bg-[#f83aef] rounded-[16777200px] shrink-0 size-[12px]" data-name="Container" />;
}

function Span30() {
  return (
    <div className="h-[16px] relative shrink-0 w-[68.195px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[34px] not-italic text-[#364153] text-[12px] text-center top-px whitespace-nowrap">Non-Fiction</p>
      </div>
    </div>
  );
}

function Container289() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center justify-center left-0 pr-[0.008px] top-0 w-[162px]" data-name="Container">
      <Container290 />
      <Span30 />
    </div>
  );
}

function Container291() {
  return (
    <div className="absolute h-[32px] left-0 top-[20px] w-[162px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-[81.53px] not-italic text-[#101828] text-[24px] text-center top-0 tracking-[0.0703px] whitespace-nowrap">0</p>
    </div>
  );
}

function Container292() {
  return (
    <div className="absolute h-[15px] left-0 top-[52px] w-[162px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[81.6px] not-italic text-[#6a7282] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">0%</p>
    </div>
  );
}

function Container288() {
  return (
    <div className="col-2 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container289 />
      <Container291 />
      <Container292 />
    </div>
  );
}

function Container282() {
  return (
    <div className="absolute gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[67px] left-[21px] top-[269px] w-[340px]" data-name="Container">
      <Container283 />
      <Container288 />
    </div>
  );
}

function Container281() {
  return (
    <div className="bg-white h-[357px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <H16 />
      <PieChart1 />
      <Container282 />
    </div>
  );
}

function H17() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">📚 Top Authors</p>
    </div>
  );
}

function Span31() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px whitespace-nowrap">Rebecca Yarros</p>
      </div>
    </div>
  );
}

function Span32() {
  return (
    <div className="h-[16px] relative shrink-0 w-[47.258px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px whitespace-nowrap">2 books</p>
      </div>
    </div>
  );
}

function Container296() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Span31 />
      <Span32 />
    </div>
  );
}

function Container297() {
  return <div className="h-[10px] rounded-[16777200px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(178.315deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%), linear-gradient(90deg, rgb(243, 244, 246) 0%, rgb(243, 244, 246) 100%)" }} />;
}

function Container295() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Container296 />
      <Container297 />
    </div>
  );
}

function Span33() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px whitespace-nowrap">David Ellis</p>
      </div>
    </div>
  );
}

function Span34() {
  return (
    <div className="h-[16px] relative shrink-0 w-[39.141px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px whitespace-nowrap">1 book</p>
      </div>
    </div>
  );
}

function Container299() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Span33 />
      <Span34 />
    </div>
  );
}

function Container301() {
  return <div className="h-[10px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(176.634deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }} />;
}

function Container300() {
  return (
    <div className="bg-[#f3f4f6] h-[10px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[170px] relative size-full">
          <Container301 />
        </div>
      </div>
    </div>
  );
}

function Container298() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Container299 />
      <Container300 />
    </div>
  );
}

function Span35() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px whitespace-nowrap">Harlan Coben</p>
      </div>
    </div>
  );
}

function Span36() {
  return (
    <div className="h-[16px] relative shrink-0 w-[39.141px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px whitespace-nowrap">1 book</p>
      </div>
    </div>
  );
}

function Container303() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Span35 />
      <Span36 />
    </div>
  );
}

function Container305() {
  return <div className="h-[10px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(176.634deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }} />;
}

function Container304() {
  return (
    <div className="bg-[#f3f4f6] h-[10px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[170px] relative size-full">
          <Container305 />
        </div>
      </div>
    </div>
  );
}

function Container302() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Container303 />
      <Container304 />
    </div>
  );
}

function Span37() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px whitespace-nowrap">Iliana Xander</p>
      </div>
    </div>
  );
}

function Span38() {
  return (
    <div className="h-[16px] relative shrink-0 w-[39.141px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px whitespace-nowrap">1 book</p>
      </div>
    </div>
  );
}

function Container307() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Span37 />
      <Span38 />
    </div>
  );
}

function Container309() {
  return <div className="h-[10px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(176.634deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }} />;
}

function Container308() {
  return (
    <div className="bg-[#f3f4f6] h-[10px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[170px] relative size-full">
          <Container309 />
        </div>
      </div>
    </div>
  );
}

function Container306() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Container307 />
      <Container308 />
    </div>
  );
}

function Span39() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px whitespace-nowrap">Ashley Elston</p>
      </div>
    </div>
  );
}

function Span40() {
  return (
    <div className="h-[16px] relative shrink-0 w-[39.141px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px whitespace-nowrap">1 book</p>
      </div>
    </div>
  );
}

function Container311() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Span39 />
      <Span40 />
    </div>
  );
}

function Container313() {
  return <div className="h-[10px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(176.634deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }} />;
}

function Container312() {
  return (
    <div className="bg-[#f3f4f6] h-[10px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[170px] relative size-full">
          <Container313 />
        </div>
      </div>
    </div>
  );
}

function Container310() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Container311 />
      <Container312 />
    </div>
  );
}

function Container294() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[208px] items-start relative shrink-0 w-full" data-name="Container">
      <Container295 />
      <Container298 />
      <Container302 />
      <Container306 />
      <Container310 />
    </div>
  );
}

function Container293() {
  return (
    <div className="bg-white h-[286px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-px pt-[21px] px-[21px] relative size-full">
        <H17 />
        <Container294 />
      </div>
    </div>
  );
}

function H18() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">📏 Book Length Distribution</p>
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute contents inset-[79.59%_67.83%_14.95%_23.35%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[79.59%_67.83%_14.95%_23.35%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">0-200</p>
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute contents inset-[79.59%_45.99%_14.95%_41.95%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[79.59%_45.99%_14.95%_41.95%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">201-400</p>
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute contents inset-[79.59%_25.77%_14.95%_62.17%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[79.59%_25.77%_14.95%_62.17%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">401-600</p>
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute contents inset-[79.59%_8.05%_14.95%_84.89%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[79.59%_8.05%_14.95%_84.89%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-center whitespace-nowrap">601+</p>
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute contents inset-[79.59%_8.05%_14.95%_23.35%]" data-name="Group">
      <Group31 />
      <Group32 />
      <Group33 />
      <Group34 />
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute contents inset-[77.27%_1.47%_1.36%_17.65%]" data-name="Group">
      <div className="absolute inset-[77.27%_1.47%_22.73%_17.65%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 275 1">
            <path d="M0 0.5H275" id="Vector" stroke="var(--stroke-0, #E5E7EB)" />
          </svg>
        </div>
      </div>
      <Group30 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[93.18%_37.5%_1.36%_53.68%] leading-[normal] not-italic text-[#808080] text-[10px] text-center whitespace-nowrap">Pages</p>
    </div>
  );
}

function Group37() {
  return (
    <div className="absolute contents inset-[74.34%_84.71%_20.2%_13.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[74.34%_84.71%_20.2%_13.24%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-right whitespace-nowrap">0</p>
    </div>
  );
}

function Group38() {
  return (
    <div className="absolute contents inset-[55.59%_84.71%_38.95%_13.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[55.59%_84.71%_38.95%_13.24%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-right whitespace-nowrap">2</p>
    </div>
  );
}

function Group39() {
  return (
    <div className="absolute contents inset-[36.84%_84.71%_57.7%_13.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[36.84%_84.71%_57.7%_13.24%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-right whitespace-nowrap">4</p>
    </div>
  );
}

function Group40() {
  return (
    <div className="absolute contents inset-[18.09%_84.71%_76.45%_13.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[18.09%_84.71%_76.45%_13.24%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-right whitespace-nowrap">6</p>
    </div>
  );
}

function Group41() {
  return (
    <div className="absolute contents inset-[0.48%_84.71%_94.07%_13.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[0.48%_84.71%_94.07%_13.24%] leading-[normal] not-italic text-[#9ca3af] text-[10px] text-right whitespace-nowrap">8</p>
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute contents inset-[0.48%_84.71%_20.2%_13.24%]" data-name="Group">
      <Group37 />
      <Group38 />
      <Group39 />
      <Group40 />
      <Group41 />
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute contents inset-[0.48%_82.35%_20.2%_13.24%]" data-name="Group">
      <div className="absolute inset-[2.27%_82.35%_22.73%_17.65%]" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 165">
            <path d="M0.5 0V165" id="Vector" stroke="var(--stroke-0, #E5E7EB)" />
          </svg>
        </div>
      </div>
      <Group36 />
    </div>
  );
}

function Group44() {
  return (
    <div className="absolute inset-[30.4%_43.93%_22.73%_39.89%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55 103.125">
        <g id="Group">
          <path d={svgPaths.p26111000} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group45() {
  return (
    <div className="absolute inset-[58.52%_23.71%_22.73%_60.11%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55 41.25">
        <g id="Group">
          <path d={svgPaths.p128b2900} fill="var(--fill-0, #F59E0B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group46() {
  return (
    <div className="absolute inset-[67.9%_3.49%_22.73%_80.33%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55 20.625">
        <g id="Group">
          <path d={svgPaths.p14bf9a00} fill="var(--fill-0, #EF4444)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group43() {
  return (
    <div className="absolute contents inset-[30.4%_3.49%_22.73%_39.89%]" data-name="Group">
      <Group44 />
      <Group45 />
      <Group46 />
    </div>
  );
}

function Group42() {
  return (
    <div className="absolute contents inset-[30.4%_3.49%_22.73%_39.89%]" data-name="Group">
      <Group43 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute h-[220px] left-0 overflow-clip top-0 w-[340px]" data-name="Icon">
      <Group29 />
      <Group35 />
      <Group42 />
    </div>
  );
}

function BarChart() {
  return (
    <div className="h-[220px] relative shrink-0 w-full" data-name="BarChart">
      <Icon3 />
    </div>
  );
}

function Container314() {
  return (
    <div className="bg-white h-[298px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-px pt-[21px] px-[21px] relative size-full">
        <H18 />
        <BarChart />
      </div>
    </div>
  );
}

function H19() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">{`⚡ Reading Speed & Time`}</p>
    </div>
  );
}

function TrendingUp1() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="TrendingUp">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="TrendingUp">
          <path d={svgPaths.pea6a680} id="Vector" stroke="var(--stroke-0, #00B8DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3155f180} id="Vector_2" stroke="var(--stroke-0, #00B8DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container318() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Reading Speed</p>
    </div>
  );
}

function Container319() {
  return (
    <div className="absolute h-[28px] left-[12px] top-[52px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">90p/day</p>
    </div>
  );
}

function Container317() {
  return (
    <div className="absolute border border-[#cefafe] border-solid h-[94px] left-0 rounded-[10px] top-0 w-[164px]" data-name="Container" style={{ backgroundImage: "linear-gradient(150.18deg, rgb(236, 254, 255) 0%, rgb(239, 246, 255) 100%)" }}>
      <TrendingUp1 />
      <Container318 />
      <Container319 />
    </div>
  );
}

function Clock3() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="Clock">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_121_6059)" id="Clock">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #615FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #615FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_121_6059">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container321() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Total Reading Time</p>
    </div>
  );
}

function Container322() {
  return (
    <div className="absolute h-[28px] left-[12px] top-[52px] w-[138px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">0h</p>
    </div>
  );
}

function Container320() {
  return (
    <div className="absolute border border-[#e0e7ff] border-solid h-[94px] left-[176px] rounded-[10px] top-0 w-[164px]" data-name="Container" style={{ backgroundImage: "linear-gradient(150.18deg, rgb(238, 242, 255) 0%, rgb(250, 245, 255) 100%)" }}>
      <Clock3 />
      <Container321 />
      <Container322 />
    </div>
  );
}

function Sparkles1() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="Sparkles">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_121_6052)" id="Sparkles">
          <path d={svgPaths.p874e300} id="Vector" stroke="var(--stroke-0, #FE9A00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 2V4.66667" id="Vector_2" stroke="var(--stroke-0, #FE9A00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.6667 3.33333H12" id="Vector_3" stroke="var(--stroke-0, #FE9A00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 11.3333V12.6667" id="Vector_4" stroke="var(--stroke-0, #FE9A00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M3.33333 12H2" id="Vector_5" stroke="var(--stroke-0, #FE9A00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_121_6052">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container324() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32px] w-[314px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px whitespace-nowrap">Best Reading Month</p>
    </div>
  );
}

function Container326() {
  return (
    <div className="h-[28px] relative shrink-0 w-[138.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-0 tracking-[-0.4395px] whitespace-nowrap">December 2025</p>
      </div>
    </div>
  );
}

function Container327() {
  return (
    <div className="h-[28px] relative shrink-0 w-[81px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#e17100] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">11 books</p>
      </div>
    </div>
  );
}

function Container325() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-center justify-between left-[12px] top-[52px] w-[314px]" data-name="Container">
      <Container326 />
      <Container327 />
    </div>
  );
}

function Container323() {
  return (
    <div className="absolute border border-[#fef3c6] border-solid h-[94px] left-0 rounded-[10px] top-[106px] w-[340px]" data-name="Container" style={{ backgroundImage: "linear-gradient(164.545deg, rgb(255, 251, 235) 0%, rgb(255, 247, 237) 100%)" }}>
      <Sparkles1 />
      <Container324 />
      <Container325 />
    </div>
  );
}

function Container316() {
  return (
    <div className="h-[200px] relative shrink-0 w-full" data-name="Container">
      <Container317 />
      <Container320 />
      <Container323 />
    </div>
  );
}

function Container315() {
  return (
    <div className="bg-white h-[278px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-px pt-[21px] px-[21px] relative size-full">
        <H19 />
        <Container316 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[5307.672px] items-start relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Button6 />
      <Container10 />
      <Container23 />
      <Container31 />
      <Container105 />
      <Container194 />
      <Container200 />
      <Container216 />
      <Container217 />
      <Container224 />
      <Container237 />
      <Container257 />
      <Container263 />
      <Container281 />
      <Container293 />
      <Container314 />
      <Container315 />
    </div>
  );
}

function Div() {
  return (
    <div className="absolute bg-[#101828] content-stretch flex flex-col gap-[24px] h-[5569.672px] items-start left-[12px] top-[252.5px] w-[382px]" data-name="div">
      <Container />
      <Button />
      <Container4 />
      <Container5 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-[#323232] relative size-full">
      <Div />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[433px] not-italic text-[30px] text-white top-[712px] w-[349px] whitespace-pre-wrap">
        {`cant read `}
        <br aria-hidden="true" />
        numbers here
      </p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[433px] not-italic text-[30px] text-white top-[951px] w-[349px]">
        have a edit button
        <br aria-hidden="true" />
        and make sure this is monthly goals not yearly
      </p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[433px] not-italic text-[30px] text-white top-[1241px] w-[349px] whitespace-pre-wrap">
        {`have this text say books `}
        <br aria-hidden="true" />
        this month not year
      </p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[433px] not-italic text-[30px] text-white top-[1733px] w-[349px]">
        this is great have the buttons for jan feb march be clickable
        <br aria-hidden="true" />
        include all months (it can scroll) and have a color difference from past months, current month, and future months
      </p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[433px] not-italic text-[30px] text-white top-[2488px] w-[349px]">{`can we inculde decimls `}</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[433px] not-italic text-[30px] text-white top-[5280px] w-[349px]">make this a circle graph</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[433px] not-italic text-[30px] text-white top-[6026px] w-[349px]">add these somewhere</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[433px] not-italic text-[30px] text-white top-[6519px] w-[349px]">add these somewhere</p>
      <div className="absolute h-[866px] left-0 top-[5838px] w-[406px]" data-name="image 22">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage22} />
      </div>
    </div>
  );
}