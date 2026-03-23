import svgPaths from "./svg-uzjguzxg2c";
import imgImageWithFallback from "figma:asset/342bc55c20cb63b402695a2cac5ef2561ff896a5.png";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_715)" id="Icon">
          <path d={svgPaths.p13a75f00} fill="var(--fill-0, #FF0000)" id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3359640} fill="var(--fill-0, #FF0000)" id="Vector_2" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2041a800} fill="var(--fill-0, #FF0000)" id="Vector_3" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1e291080} fill="var(--fill-0, #FF0000)" id="Vector_4" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120b5900} id="Vector_5" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_1_715">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[135.289px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#d1d5db] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Choose Your Theme</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-0 w-[382px]" data-name="Container">
      <Icon />
      <Heading1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M5 12H19" id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 5V19" id="Vector_2" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ThemePicker1() {
  return (
    <div className="bg-[#1a0a28] h-[56px] relative rounded-[16777200px] shrink-0 w-full" data-name="ThemePicker">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] py-[2px] relative size-full">
          <Icon1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[red] border-dashed inset-0 pointer-events-none rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ThemePicker2() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[28.09px] not-italic text-[10px] text-[red] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Create</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker1 />
      <ThemePicker2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[106.5px] left-[16px] top-0 w-[56px]" data-name="Container">
      <Button />
    </div>
  );
}

function ThemePicker3() {
  return <div className="h-[56px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" style={{ backgroundImage: "linear-gradient(135deg, rgb(50, 152, 255) 0%, rgb(248, 58, 239) 100%)" }} />;
}

function ThemePicker4() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[34.5px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Ocean Sunset</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker3 />
      <ThemePicker4 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[106.5px] left-[84px] top-0 w-[56px]" data-name="Container">
      <Button1 />
    </div>
  );
}

function ThemePicker5() {
  return <div className="h-[56px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" style={{ backgroundImage: "linear-gradient(135deg, rgb(160, 120, 86) 0%, rgb(200, 183, 153) 100%)" }} />;
}

function ThemePicker6() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[27.9px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Neutral</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker5 />
      <ThemePicker6 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[106.5px] left-[152px] top-0 w-[56px]" data-name="Container">
      <Button2 />
    </div>
  );
}

function ThemePicker7() {
  return <div className="h-[56px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 0, 0) 0%, rgb(75, 85, 99) 100%)" }} />;
}

function ThemePicker8() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[32.5px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Monochrome</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker7 />
      <ThemePicker8 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[106.5px] left-[220px] top-0 w-[56px]" data-name="Container">
      <Button3 />
    </div>
  );
}

function ThemePicker9() {
  return <div className="h-[56px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" style={{ backgroundImage: "linear-gradient(135deg, rgb(124, 45, 58) 0%, rgb(74, 21, 32) 100%)" }} />;
}

function ThemePicker10() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[28.73px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Burgundy</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker9 />
      <ThemePicker10 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[106.5px] left-[288px] top-0 w-[56px]" data-name="Container">
      <Button4 />
    </div>
  );
}

function ThemePicker11() {
  return <div className="bg-[#9fa8da] h-[56px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" />;
}

function ThemePicker12() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[28.2px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Periwinkle</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker11 />
      <ThemePicker12 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[106.5px] left-[356px] top-0 w-[56px]" data-name="Container">
      <Button5 />
    </div>
  );
}

function ThemePicker13() {
  return <div className="h-[56px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 107, 107) 0%, rgb(255, 217, 61) 100%)" }} />;
}

function ThemePicker14() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[32.5px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Sunset Coral</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker13 />
      <ThemePicker14 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[106.5px] left-[424px] top-0 w-[56px]" data-name="Container">
      <Button6 />
    </div>
  );
}

function ThemePicker15() {
  return <div className="h-[56px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" style={{ backgroundImage: "linear-gradient(135deg, rgb(45, 106, 79) 0%, rgb(82, 183, 136) 100%)" }} />;
}

function ThemePicker16() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[28.84px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Forest</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker15 />
      <ThemePicker16 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[106.5px] left-[492px] top-0 w-[56px]" data-name="Container">
      <Button7 />
    </div>
  );
}

function ThemePicker17() {
  return <div className="h-[56px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" style={{ backgroundImage: "linear-gradient(135deg, rgb(157, 78, 221) 0%, rgb(199, 125, 255) 100%)" }} />;
}

function ThemePicker18() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[28.3px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Lavender</p>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker17 />
      <ThemePicker18 />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[106.5px] left-[560px] top-0 w-[56px]" data-name="Container">
      <Button8 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p39be50} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-white relative rounded-[16777200px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[4px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function ThemePicker19() {
  return (
    <div className="h-[56px] relative rounded-[16777200px] shadow-[0px_0px_0px_2px_white,0px_0px_0px_5px_#252525,0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%), linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%)" }}>
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Container12 />
        </div>
      </div>
    </div>
  );
}

function ThemePicker20() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[44.5px] not-italic text-[10px] text-[red] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Electric Spectrum</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker19 />
      <ThemePicker20 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[106.5px] left-[628px] top-0 w-[56px]" data-name="Container">
      <Button9 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[8px] size-[12px] top-[4.75px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_1_722)" id="Icon">
          <path d={svgPaths.p27b3900} id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_1_722">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-[#1a0a28] border border-[#2d1142] border-solid h-[23.5px] left-[2.24px] rounded-[8px] top-[83px] w-[51.508px]" data-name="Button">
      <Icon3 />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[13.5px] left-[33px] not-italic text-[9px] text-[red] text-center top-[4.5px] tracking-[0.167px] whitespace-nowrap">Edit</p>
    </div>
  );
}

function ThemePicker21() {
  return <div className="h-[56px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" style={{ backgroundImage: "linear-gradient(135deg, rgb(236, 72, 153) 0%, rgb(50, 152, 255) 100%)" }} />;
}

function ThemePicker22() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[46px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">My Custom Theme</p>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker21 />
      <ThemePicker22 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[106.5px] left-[696px] top-0 w-[56px]" data-name="Container">
      <Button10 />
      <Button11 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[8px] size-[12px] top-[4.75px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_1_722)" id="Icon">
          <path d={svgPaths.p27b3900} id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_1_722">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute bg-[#1a0a28] border border-[#2d1142] border-solid h-[23.5px] left-[2.24px] rounded-[8px] top-[83px] w-[51.508px]" data-name="Button">
      <Icon4 />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[13.5px] left-[33px] not-italic text-[9px] text-[red] text-center top-[4.5px] tracking-[0.167px] whitespace-nowrap">Edit</p>
    </div>
  );
}

function ThemePicker23() {
  return <div className="h-[56px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="ThemePicker" style={{ backgroundImage: "linear-gradient(135deg, rgb(54, 9, 9) 0%, rgb(0, 0, 0) 100%)" }} />;
}

function ThemePicker24() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="ThemePicker">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[46px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">My Custom Theme</p>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[79px] items-start left-0 top-0 w-[56px]" data-name="Button">
      <ThemePicker23 />
      <ThemePicker24 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[106.5px] left-[764px] top-0 w-[56px]" data-name="Container">
      <Button12 />
      <Button13 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[114.5px] left-[-16px] overflow-clip top-[32px] w-[414px]" data-name="Container">
      <Container2 />
      <Container3 />
      <Container4 />
      <Container5 />
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
      <Container10 />
      <Container11 />
      <Container13 />
      <Container14 />
    </div>
  );
}

function ThemePicker() {
  return (
    <div className="absolute h-[146.5px] left-0 top-0 w-[382px]" data-name="ThemePicker">
      <Container />
      <Container1 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[16px] left-[13.26px] overflow-clip top-[72px] w-[37.477px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[19px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Streak</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p2a5df780} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon5 />
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container17 />
    </div>
  );
}

function Button14() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container15 />
        <Container16 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute h-[16px] left-[6.05px] overflow-clip top-[72px] w-[51.898px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[26px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Calendar</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d="M9.33333 2.33333V7" id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M18.6667 2.33333V7" id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p57f3600} id="Vector_3" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M3.5 11.6667H24.5" id="Vector_4" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon6 />
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container20 />
    </div>
  );
}

function Button15() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container18 />
        <Container19 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[32px] left-0 overflow-clip top-[72px] w-[64px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[32.46px] not-italic text-[#f3f4f6] text-[12px] text-center top-px w-[37px]">March Reads</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d="M14 8.16667V24.5" id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p3a72eb00} id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon7 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container23 />
    </div>
  );
}

function Button16() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container21 />
        <Container22 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[32px] left-0 overflow-clip top-[72px] w-[64px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[32.3px] not-italic text-[#f3f4f6] text-[12px] text-center top-px w-[36px]">Books 2026</p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p19670c80} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container26() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon8 />
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container26 />
    </div>
  );
}

function Button17() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container24 />
        <Container25 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[16px] left-[16.98px] overflow-clip top-[72px] w-[30.047px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[15px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Stats</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.pfc0d900} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p2eb2b880} id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon9 />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container29 />
    </div>
  );
}

function Button18() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute h-[16px] left-[1.47px] overflow-clip top-[72px] w-[61.063px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[31px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Pages/Day</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p3997a780} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p275e0300} id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon10 />
        </div>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container32 />
    </div>
  );
}

function Button19() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container30 />
        <Container31 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute h-[16px] left-[5.58px] overflow-clip top-[72px] w-[52.844px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[26.5px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Listening</p>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.pcd14e00} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon11 />
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container35 />
    </div>
  );
}

function Button20() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container33 />
        <Container34 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute h-[16px] left-[14.4px] overflow-clip top-[72px] w-[35.203px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[18px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Pages</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d="M14 8.16667V24.5" id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p3a72eb00} id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon12 />
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container38 />
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container36 />
        <Container37 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute h-[16px] left-[2.17px] overflow-clip top-[72px] w-[59.656px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[30px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">This Week</p>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d="M9.33333 2.33333V7" id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M18.6667 2.33333V7" id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p57f3600} id="Vector_3" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M3.5 11.6667H24.5" id="Vector_4" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container41() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon13 />
        </div>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container41 />
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container39 />
        <Container40 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute h-[16px] left-[15.67px] overflow-clip top-[72px] w-[32.648px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[16.5px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Goals</p>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p1fa66600} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p190dabf0} id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p2a9abe70} id="Vector_3" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container44() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon14 />
        </div>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container44 />
    </div>
  );
}

function Button23() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container42 />
        <Container43 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute h-[16px] left-[16.98px] overflow-clip top-[72px] w-[30.047px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[15px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Stats</p>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p3997a780} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p275e0300} id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon15 />
        </div>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container47 />
    </div>
  );
}

function Button24() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container45 />
        <Container46 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute h-[16px] left-[5.34px] overflow-clip top-[72px] w-[53.32px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[27px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Averages</p>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p1fa66600} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M14 7V14L18.6667 16.3333" id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container50() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon16 />
        </div>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container50 />
    </div>
  );
}

function Button25() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container48 />
        <Container49 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute h-[16px] left-[16.8px] overflow-clip top-[72px] w-[30.406px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[15.5px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">2026</p>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p3ff84700} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M23.3333 3.5V8.16667" id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M25.6667 5.83333H21" id="Vector_3" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M4.66667 19.8333V22.1667" id="Vector_4" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M5.83333 21H3.5" id="Vector_5" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container53() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon17 />
        </div>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container53 />
    </div>
  );
}

function Button26() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container51 />
        <Container52 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="absolute h-[16px] left-[13.96px] overflow-clip top-[72px] w-[36.078px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[18px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">March</p>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d="M9.33333 2.33333V7" id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M18.6667 2.33333V7" id="Vector_2" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p57f3600} id="Vector_3" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M3.5 11.6667H24.5" id="Vector_4" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container56() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon18 />
        </div>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container56 />
    </div>
  );
}

function Button27() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container54 />
        <Container55 />
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="absolute h-[16px] left-[13.26px] overflow-clip top-[72px] w-[37.477px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[19px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Streak</p>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p2a5df780} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container59() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon19 />
        </div>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container59 />
    </div>
  );
}

function Button28() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container57 />
        <Container58 />
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute h-[16px] left-[13.63px] overflow-clip top-[72px] w-[36.734px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[18.5px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Speed</p>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p221c4a00} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon20 />
        </div>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container62 />
    </div>
  );
}

function Button29() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container60 />
        <Container61 />
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute h-[16px] left-[10.23px] overflow-clip top-[72px] w-[43.539px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[22px] not-italic text-[#f3f4f6] text-[12px] text-center top-px whitespace-nowrap">Ratings</p>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p1dcc0100} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container65() {
  return (
    <div className="bg-[#1a0a28] h-[60px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <Icon21 />
        </div>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[2px] px-[2px] rounded-[16777200px] size-[64px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container65 />
    </div>
  );
}

function Button30() {
  return (
    <div className="h-[104px] relative shrink-0 w-[64px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container63 />
        <Container64 />
      </div>
    </div>
  );
}

function ReadingStories() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[112px] items-start left-[-4px] overflow-clip pl-[4px] top-[370.5px] w-[390px]" data-name="ReadingStories">
      <Button14 />
      <Button15 />
      <Button16 />
      <Button17 />
      <Button18 />
      <Button19 />
      <Button20 />
      <Button21 />
      <Button22 />
      <Button23 />
      <Button24 />
      <Button25 />
      <Button26 />
      <Button27 />
      <Button28 />
      <Button29 />
      <Button30 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[28px] relative shrink-0 w-[170.141px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#f3f4f6] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">Currently Reading</p>
      </div>
    </div>
  );
}

function Button31() {
  return (
    <div className="h-[16px] relative shrink-0 w-[47.125px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[24.5px] not-italic text-[12px] text-[red] text-center top-px whitespace-nowrap">View All</p>
      </div>
    </div>
  );
}

function Dashboard1() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Dashboard">
      <Heading />
      <Button31 />
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 4.16667V15.8333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative rounded-[16777200px] shrink-0 size-[40px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] relative size-full">
        <Icon22 />
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#f3f4f6] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Add Book</p>
    </div>
  );
}

function Container70() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6b7280] text-[12px] top-px whitespace-nowrap">Start tracking a new read</p>
    </div>
  );
}

function Container68() {
  return (
    <div className="h-[36px] relative shrink-0 w-[145.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container69 />
        <Container70 />
      </div>
    </div>
  );
}

function Dashboard2() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[40px] items-center justify-center left-[18px] px-[76.25px] top-[18px] w-[346px]" data-name="Dashboard">
      <Container67 />
      <Container68 />
    </div>
  );
}

function Button32() {
  return (
    <div className="bg-[#1a0a28] h-[76px] relative rounded-[14px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#2d1142] border-dashed inset-0 pointer-events-none rounded-[14px]" />
      <Dashboard2 />
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[136px] items-start left-0 top-[506.5px] w-[382px]" data-name="Container">
      <Dashboard1 />
      <Button32 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3a2fa580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="flex-[1_0_0] h-[27px] min-h-px min-w-px relative" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[18px] text-white top-[0.5px] tracking-[-0.4395px] whitespace-nowrap">Reading Goals</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="h-[27px] relative shrink-0 w-[150.805px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon23 />
        <Heading2 />
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-[8.33%_12.43%]" data-name="Vector">
          <div className="absolute inset-[-5%_-5.54%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6872 12.8333">
              <path d={svgPaths.p19ed0080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-16.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66667 4.66667">
              <path d={svgPaths.p22c75d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button33() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[22px] relative rounded-[10px] shrink-0 w-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function Dashboard3() {
  return (
    <div className="content-stretch flex h-[27px] items-center justify-between relative shrink-0 w-full" data-name="Dashboard">
      <Container72 />
      <Button33 />
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute h-[16px] left-0 top-0 w-[342px]" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] top-px whitespace-nowrap">TODAY</p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.9)] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Pages</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[47.227px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">47 / 25</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Container77() {
  return <div className="bg-white h-[8px] rounded-[16777200px] shrink-0 w-full" data-name="Container" />;
}

function Container76() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] content-stretch flex flex-col h-[8px] items-start overflow-clip relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <Container77 />
    </div>
  );
}

function Container74() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[34px] items-start left-0 top-[22px] w-[342px]" data-name="Container">
      <Container75 />
      <Container76 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[51.297px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.9)] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Minutes</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.477px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">0 / 30</p>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text2 />
      <Text3 />
    </div>
  );
}

function Container81() {
  return <div className="bg-white h-[8px] rounded-[16777200px] shrink-0 w-full" data-name="Container" />;
}

function Container80() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[8px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[342px] relative size-full">
          <Container81 />
        </div>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[34px] items-start left-0 top-[64px] w-[342px]" data-name="Container">
      <Container79 />
      <Container80 />
    </div>
  );
}

function Dashboard4() {
  return (
    <div className="h-[98px] relative shrink-0 w-full" data-name="Dashboard">
      <Container73 />
      <Container74 />
      <Container78 />
    </div>
  );
}

function Container82() {
  return (
    <div className="absolute h-[16px] left-0 top-0 w-[342px]" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] top-px whitespace-nowrap">THIS MONTH</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.648px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.9)] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Books</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[29.781px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">4 / 2</p>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text4 />
      <Text5 />
    </div>
  );
}

function Container86() {
  return <div className="bg-white h-[8px] rounded-[16777200px] shrink-0 w-full" data-name="Container" />;
}

function Container85() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] content-stretch flex flex-col h-[8px] items-start overflow-clip relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <Container86 />
    </div>
  );
}

function Container83() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[34px] items-start left-0 top-[22px] w-[342px]" data-name="Container">
      <Container84 />
      <Container85 />
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.9)] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Pages</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[76.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">2389 / 600</p>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text6 />
      <Text7 />
    </div>
  );
}

function Container90() {
  return <div className="bg-white h-[8px] rounded-[16777200px] shrink-0 w-full" data-name="Container" />;
}

function Container89() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] content-stretch flex flex-col h-[8px] items-start overflow-clip relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <Container90 />
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[34px] items-start left-0 top-[64px] w-[342px]" data-name="Container">
      <Container88 />
      <Container89 />
    </div>
  );
}

function Dashboard5() {
  return (
    <div className="h-[98px] relative shrink-0 w-full" data-name="Dashboard">
      <Container82 />
      <Container83 />
      <Container87 />
    </div>
  );
}

function Container91() {
  return (
    <div className="absolute h-[16px] left-0 top-0 w-[342px]" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] top-px whitespace-nowrap">THIS YEAR (2026)</p>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.648px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.9)] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Books</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[36.789px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">4 / 12</p>
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text8 />
      <Text9 />
    </div>
  );
}

function Container95() {
  return <div className="bg-white h-[8px] rounded-[16777200px] shrink-0 w-full" data-name="Container" />;
}

function Container94() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[8px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[228px] relative size-full">
          <Container95 />
        </div>
      </div>
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[34px] items-start left-0 top-[22px] w-[342px]" data-name="Container">
      <Container93 />
      <Container94 />
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.9)] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Pages</p>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[20px] relative shrink-0 w-[85.922px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">2389 / 5000</p>
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text10 />
      <Text11 />
    </div>
  );
}

function Container99() {
  return <div className="bg-white h-[8px] rounded-[16777200px] shrink-0 w-full" data-name="Container" />;
}

function Container98() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[8px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[178.594px] relative size-full">
          <Container99 />
        </div>
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[34px] items-start left-0 top-[64px] w-[342px]" data-name="Container">
      <Container97 />
      <Container98 />
    </div>
  );
}

function Dashboard6() {
  return (
    <div className="h-[98px] relative shrink-0 w-full" data-name="Dashboard">
      <Container91 />
      <Container92 />
      <Container96 />
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[397px] items-start left-0 pt-[20px] px-[20px] rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] top-[666.5px] w-[382px]" data-name="Container" style={{ backgroundImage: "linear-gradient(133.897deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Dashboard3 />
      <Dashboard4 />
      <Dashboard5 />
      <Dashboard6 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-3/4 left-[33.33%] right-[66.67%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 5">
            <path d="M0.833333 0.833333V4.16667" id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[66.67%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 5">
            <path d="M0.833333 0.833333V4.16667" id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
            <path d={svgPaths.pf3beb80} id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_12.5%_58.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 1.66667">
            <path d="M0.833333 0.833333H15.8333" id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="bg-[rgba(255,0,0,0.13)] relative rounded-[14px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[10px] px-[10px] relative size-full">
        <Icon25 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[18px] text-white top-[0.5px] tracking-[-0.4395px] whitespace-nowrap">This Week</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">Track your reading days</p>
    </div>
  );
}

function Container103() {
  return (
    <div className="flex-[1_0_0] h-[43px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading3 />
        <Paragraph />
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div className="h-[43px] relative shrink-0 w-[187.117px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container102 />
        <Container103 />
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.33%_8.34%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6665 14.6664">
            <path d={svgPaths.p4290a20} id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button34() {
  return (
    <div className="bg-[rgba(255,0,0,0.13)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon26 />
      </div>
    </div>
  );
}

function Dashboard7() {
  return (
    <div className="content-stretch flex h-[43px] items-start justify-between relative shrink-0 w-full" data-name="Dashboard">
      <Container101 />
      <Button34 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p92a8700} id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container106() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">1 Day Streak! 🔥</p>
    </div>
  );
}

function Container107() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">Keep it going!</p>
    </div>
  );
}

function Container105() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container106 />
        <Container107 />
      </div>
    </div>
  );
}

function Dashboard8() {
  return (
    <div className="h-[36px] relative shrink-0 w-[135.938px]" data-name="Dashboard">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon27 />
        <Container105 />
      </div>
    </div>
  );
}

function Dashboard9() {
  return (
    <div className="h-[32px] relative shrink-0 w-[11.734px]" data-name="Dashboard">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-[red] top-0 tracking-[0.0703px] whitespace-nowrap">1</p>
      </div>
    </div>
  );
}

function Container104() {
  return (
    <div className="h-[62px] relative rounded-[14px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(169.665deg, rgba(255, 0, 0, 0.082) 0%, rgba(255, 0, 0, 0.145) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[rgba(255,0,0,0.25)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <Dashboard8 />
          <Dashboard9 />
        </div>
      </div>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M20 6L9 17L4 12" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[28px] relative shrink-0 w-[177.352px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[89px] not-italic text-[18px] text-center text-white top-0 tracking-[-0.4395px] whitespace-nowrap">Marked for Today! 🎉</p>
      </div>
    </div>
  );
}

function Dashboard10() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[28px] items-center justify-center left-[16px] pl-[49.32px] pr-[49.328px] top-[16px] w-[308px]" data-name="Dashboard">
      <Icon28 />
      <Text12 />
    </div>
  );
}

function Button35() {
  return (
    <div className="bg-[red] h-[60px] opacity-90 relative rounded-[14px] shrink-0 w-full" data-name="Button">
      <Dashboard10 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-9.09%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 10.8333">
            <path d={svgPaths.p38669a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container108() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon29 />
      </div>
    </div>
  );
}

function Dashboard12() {
  return (
    <div className="bg-[red] h-[48px] relative rounded-[10px] shrink-0 w-full" data-name="Dashboard">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[10.852px] pr-[10.859px] relative size-full">
          <Container108 />
        </div>
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div className="absolute h-[12px] left-0 top-[15px] w-[41.711px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[12px] left-[21.05px] not-italic text-[8px] text-[red] text-center top-[0.5px] tracking-[0.2057px] whitespace-nowrap">Today</p>
    </div>
  );
}

function Dashboard13() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[21.31px] not-italic text-[10px] text-[red] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">M</p>
      <Container109 />
    </div>
  );
}

function Button36() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[81px] items-start left-0 top-0 w-[41.711px]" data-name="Button">
      <Dashboard12 />
      <Dashboard13 />
    </div>
  );
}

function Dashboard14() {
  return <div className="bg-[#374151] h-[48px] rounded-[10px] shrink-0 w-full" data-name="Dashboard" />;
}

function Dashboard15() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[21.04px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">T</p>
    </div>
  );
}

function Button37() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[81px] items-start left-[49.71px] pt-[6px] top-0 w-[41.711px]" data-name="Button">
      <Dashboard14 />
      <Dashboard15 />
    </div>
  );
}

function Dashboard16() {
  return <div className="bg-[#374151] h-[48px] rounded-[10px] shrink-0 w-full" data-name="Dashboard" />;
}

function Dashboard17() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[21.32px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">W</p>
    </div>
  );
}

function Button38() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[81px] items-start left-[99.42px] pt-[6px] top-0 w-[41.719px]" data-name="Button">
      <Dashboard16 />
      <Dashboard17 />
    </div>
  );
}

function Dashboard18() {
  return <div className="bg-[#374151] h-[48px] rounded-[10px] shrink-0 w-full" data-name="Dashboard" />;
}

function Dashboard19() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[21.04px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">T</p>
    </div>
  );
}

function Button39() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[81px] items-start left-[149.14px] pt-[6px] top-0 w-[41.711px]" data-name="Button">
      <Dashboard18 />
      <Dashboard19 />
    </div>
  );
}

function Dashboard20() {
  return <div className="bg-[#374151] h-[48px] rounded-[10px] shrink-0 w-full" data-name="Dashboard" />;
}

function Dashboard21() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[20.85px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">F</p>
    </div>
  );
}

function Button40() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[81px] items-start left-[198.85px] pt-[6px] top-0 w-[41.719px]" data-name="Button">
      <Dashboard20 />
      <Dashboard21 />
    </div>
  );
}

function Dashboard22() {
  return <div className="bg-[#374151] h-[48px] rounded-[10px] shrink-0 w-full" data-name="Dashboard" />;
}

function Dashboard23() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[20.98px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">S</p>
    </div>
  );
}

function Button41() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[81px] items-start left-[248.57px] pt-[6px] top-0 w-[41.711px]" data-name="Button">
      <Dashboard22 />
      <Dashboard23 />
    </div>
  );
}

function Dashboard24() {
  return <div className="bg-[#374151] h-[48px] rounded-[10px] shrink-0 w-full" data-name="Dashboard" />;
}

function Dashboard25() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[20.98px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] tracking-[0.1172px] whitespace-nowrap">S</p>
    </div>
  );
}

function Button42() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[81px] items-start left-[298.28px] pt-[6px] top-0 w-[41.719px]" data-name="Button">
      <Dashboard24 />
      <Dashboard25 />
    </div>
  );
}

function Dashboard11() {
  return (
    <div className="h-[81px] relative shrink-0 w-full" data-name="Dashboard">
      <Button36 />
      <Button37 />
      <Button38 />
      <Button39 />
      <Button40 />
      <Button41 />
      <Button42 />
    </div>
  );
}

function Container100() {
  return (
    <div className="absolute bg-[#1a0a28] content-stretch flex flex-col gap-[16px] h-[336px] items-start left-0 pb-px pt-[21px] px-[21px] rounded-[16px] top-[1087.5px] w-[382px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#2d1142] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <Dashboard7 />
      <Container104 />
      <Button35 />
      <Dashboard11 />
    </div>
  );
}

function Icon30() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%_20.83%_8.33%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-5.26%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 14">
            <path d={svgPaths.p239a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container112() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon30 />
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start justify-between left-[16px] pr-[121px] top-[16px] w-[153px]" data-name="Container">
      <Container112 />
    </div>
  );
}

function Container113() {
  return (
    <div className="absolute h-[32px] left-[16px] top-[56px] w-[153px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-white top-0 tracking-[0.0703px] whitespace-nowrap">1</p>
    </div>
  );
}

function Container114() {
  return (
    <div className="absolute h-[16px] left-[16px] top-[90px] w-[153px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.8)] top-px whitespace-nowrap">Reading Streak</p>
    </div>
  );
}

function Container115() {
  return (
    <div className="absolute h-[15px] left-[16px] top-[110px] w-[153px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.6)] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">day 🔥</p>
    </div>
  );
}

function StatCard() {
  return (
    <div className="col-1 h-[141px] justify-self-stretch relative rounded-[14px] row-1 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0" data-name="StatCard" style={{ backgroundImage: "linear-gradient(142.687deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Container111 />
      <Container113 />
      <Container114 />
      <Container115 />
    </div>
  );
}

function Icon31() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 14.6667">
            <path d={svgPaths.p3e5daf60} id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container117() {
  return (
    <div className="bg-[rgba(255,0,0,0.13)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon31 />
      </div>
    </div>
  );
}

function Container116() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start justify-between left-[17px] pr-[119px] top-[17px] w-[151px]" data-name="Container">
      <Container117 />
    </div>
  );
}

function Container118() {
  return (
    <div className="absolute h-[32px] left-[17px] top-[57px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#f3f4f6] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">4</p>
    </div>
  );
}

function Container119() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[91px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">Books in 2026</p>
    </div>
  );
}

function Container120() {
  return (
    <div className="absolute h-[15px] left-[17px] top-[111px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6b7280] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">+4 this month</p>
    </div>
  );
}

function StatCard1() {
  return (
    <div className="bg-[#1a0a28] col-2 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="StatCard">
      <div aria-hidden="true" className="absolute border border-[#2d1142] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Container116 />
      <Container118 />
      <Container119 />
      <Container120 />
    </div>
  );
}

function Icon32() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
            <path d={svgPaths.p22d7ae80} id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container122() {
  return (
    <div className="bg-[rgba(255,0,0,0.13)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon32 />
      </div>
    </div>
  );
}

function Container121() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start justify-between left-[17px] pr-[119px] top-[17px] w-[151px]" data-name="Container">
      <Container122 />
    </div>
  );
}

function Container123() {
  return (
    <div className="absolute h-[32px] left-[17px] top-[57px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#f3f4f6] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">0h</p>
    </div>
  );
}

function Container124() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[91px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">Hours Listened</p>
    </div>
  );
}

function Container125() {
  return (
    <div className="absolute h-[15px] left-[17px] top-[111px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6b7280] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">No audiobooks</p>
    </div>
  );
}

function StatCard2() {
  return (
    <div className="bg-[#1a0a28] col-1 justify-self-stretch relative rounded-[14px] row-2 self-stretch shrink-0" data-name="StatCard">
      <div aria-hidden="true" className="absolute border border-[#2d1142] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Container121 />
      <Container123 />
      <Container124 />
      <Container125 />
    </div>
  );
}

function Icon33() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[12.5%] left-1/2 right-1/2 top-[29.17%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 10.6667">
            <path d="M0.666667 0.666667V10" id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5.56%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 13.3333">
            <path d={svgPaths.p2af7f600} id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container127() {
  return (
    <div className="bg-[rgba(255,0,0,0.13)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon33 />
      </div>
    </div>
  );
}

function Container126() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start justify-between left-[17px] pr-[119px] top-[17px] w-[151px]" data-name="Container">
      <Container127 />
    </div>
  );
}

function Container128() {
  return (
    <div className="absolute h-[32px] left-[17px] top-[57px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#f3f4f6] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">2.4K</p>
    </div>
  );
}

function Container129() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[91px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">Pages Read</p>
    </div>
  );
}

function Container130() {
  return (
    <div className="absolute h-[15px] left-[17px] top-[111px] w-[151px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6b7280] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Avg. 2389/day</p>
    </div>
  );
}

function StatCard3() {
  return (
    <div className="bg-[#1a0a28] col-2 justify-self-stretch relative rounded-[14px] row-2 self-stretch shrink-0" data-name="StatCard">
      <div aria-hidden="true" className="absolute border border-[#2d1142] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Container126 />
      <Container128 />
      <Container129 />
      <Container130 />
    </div>
  );
}

function Container110() {
  return (
    <div className="absolute gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(2,minmax(0,1fr))] h-[298px] left-0 top-[1447.5px] w-[382px]" data-name="Container">
      <StatCard />
      <StatCard1 />
      <StatCard2 />
      <StatCard3 />
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_622)" id="Icon">
          <path d={svgPaths.p24941500} id="Vector" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 2.5V5.83333" id="Vector_2" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 4.16667H15" id="Vector_3" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M3.33333 14.1667V15.8333" id="Vector_4" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M4.16667 15H2.5" id="Vector_5" stroke="var(--stroke-0, #FF0000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_1_622">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading4() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#f3f4f6] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">Recommended for You</p>
      </div>
    </div>
  );
}

function Container132() {
  return (
    <div className="h-[28px] relative shrink-0 w-[240.586px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon34 />
        <Heading4 />
      </div>
    </div>
  );
}

function Dashboard26() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-center justify-between left-0 pr-[141.414px] top-0 w-[382px]" data-name="Dashboard">
      <Container132 />
    </div>
  );
}

function Dashboard28() {
  return (
    <div className="absolute h-[16px] left-0 overflow-clip top-[200px] w-[128px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[#f3f4f6] text-[12px] top-px whitespace-nowrap">Iron Flame</p>
    </div>
  );
}

function Dashboard29() {
  return (
    <div className="absolute h-[15px] left-0 top-[218px] w-[128px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#9ca3af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Rebecca Yarros</p>
    </div>
  );
}

function ImageWithFallback() {
  return <div className="absolute h-[192px] left-0 top-0 w-[128px]" data-name="ImageWithFallback" />;
}

function Text13() {
  return (
    <div className="flex-[1_0_0] h-[22.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[11.25px] left-0 not-italic text-[9px] text-white top-0 tracking-[0.167px] w-[86px]">Because you loved Fourth Wing</p>
      </div>
    </div>
  );
}

function Container134() {
  return (
    <div className="absolute bg-gradient-to-t content-stretch flex from-[rgba(0,0,0,0.6)] h-[192px] items-end left-0 pb-[8px] px-[8px] to-[rgba(0,0,0,0)] top-0 w-[128px]" data-name="Container">
      <Text13 />
    </div>
  );
}

function Dashboard30() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[192px] left-0 overflow-clip rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[128px]" data-name="Dashboard">
      <ImageWithFallback />
      <Container134 />
    </div>
  );
}

function Container133() {
  return (
    <div className="h-[233px] relative shrink-0 w-[128px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Dashboard28 />
        <Dashboard29 />
        <Dashboard30 />
      </div>
    </div>
  );
}

function Dashboard31() {
  return (
    <div className="absolute h-[16px] left-0 overflow-clip top-[200px] w-[128px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[#f3f4f6] text-[12px] top-px whitespace-nowrap">The Inmate</p>
    </div>
  );
}

function Dashboard32() {
  return (
    <div className="absolute h-[15px] left-0 top-[218px] w-[128px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#9ca3af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Freida McFadden</p>
    </div>
  );
}

function ImageWithFallback1() {
  return <div className="absolute h-[192px] left-0 top-0 w-[128px]" data-name="ImageWithFallback" />;
}

function Text14() {
  return (
    <div className="flex-[1_0_0] h-[22.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[11.25px] left-0 not-italic text-[9px] text-white top-0 tracking-[0.167px] w-[64px]">Similar to The Housemaid</p>
      </div>
    </div>
  );
}

function Container136() {
  return (
    <div className="absolute bg-gradient-to-t content-stretch flex from-[rgba(0,0,0,0.6)] h-[192px] items-end left-0 pb-[8px] px-[8px] to-[rgba(0,0,0,0)] top-0 w-[128px]" data-name="Container">
      <Text14 />
    </div>
  );
}

function Dashboard33() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[192px] left-0 overflow-clip rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[128px]" data-name="Dashboard">
      <ImageWithFallback1 />
      <Container136 />
    </div>
  );
}

function Container135() {
  return (
    <div className="h-[233px] relative shrink-0 w-[128px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Dashboard31 />
        <Dashboard32 />
        <Dashboard33 />
      </div>
    </div>
  );
}

function Dashboard34() {
  return (
    <div className="absolute h-[16px] left-0 overflow-clip top-[200px] w-[128px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[#f3f4f6] text-[12px] top-px whitespace-nowrap">Artemis</p>
    </div>
  );
}

function Dashboard35() {
  return (
    <div className="absolute h-[15px] left-0 top-[218px] w-[128px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#9ca3af] text-[10px] top-[0.5px] tracking-[0.1172px] whitespace-nowrap">Andy Weir</p>
    </div>
  );
}

function ImageWithFallback2() {
  return (
    <div className="absolute h-[192px] left-0 top-0 w-[128px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[11.25px] relative shrink-0 w-[96.609px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[11.25px] not-italic relative shrink-0 text-[9px] text-white tracking-[0.167px] whitespace-nowrap">More from Andy Weir</p>
      </div>
    </div>
  );
}

function Container138() {
  return (
    <div className="absolute bg-gradient-to-t content-stretch flex from-[rgba(0,0,0,0.6)] h-[192px] items-end left-0 pb-[8px] pl-[8px] to-[rgba(0,0,0,0)] top-0 w-[128px]" data-name="Container">
      <Text15 />
    </div>
  );
}

function Dashboard36() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[192px] left-0 overflow-clip rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[128px]" data-name="Dashboard">
      <ImageWithFallback2 />
      <Container138 />
    </div>
  );
}

function Container137() {
  return (
    <div className="h-[233px] relative shrink-0 w-[128px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Dashboard34 />
        <Dashboard35 />
        <Dashboard36 />
      </div>
    </div>
  );
}

function Dashboard27() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[241px] items-start left-[-16px] overflow-clip pl-[16px] top-[44px] w-[414px]" data-name="Dashboard">
      <Container133 />
      <Container135 />
      <Container137 />
    </div>
  );
}

function Container131() {
  return (
    <div className="absolute h-[285px] left-0 top-[1769.5px] w-[382px]" data-name="Container">
      <Dashboard26 />
      <Dashboard27 />
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p164f7540} id="Vector" stroke="var(--stroke-0, #FE9A00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p809b580} id="Vector_2" stroke="var(--stroke-0, #FE9A00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading5() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#f3f4f6] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">Recent Badges</p>
      </div>
    </div>
  );
}

function Container140() {
  return (
    <div className="h-[28px] relative shrink-0 w-[169.313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon35 />
        <Heading5 />
      </div>
    </div>
  );
}

function Button43() {
  return (
    <div className="h-[16px] relative shrink-0 w-[47.125px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[24.5px] not-italic text-[12px] text-[red] text-center top-px whitespace-nowrap">View All</p>
      </div>
    </div>
  );
}

function Dashboard37() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Dashboard">
      <Container140 />
      <Button43 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="absolute left-[17px] size-[24px] top-[17px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3eeeaa80} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2f14bd80} id="Vector_2" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Dashboard39() {
  return (
    <div className="absolute h-[20px] left-[17px] top-[49px] w-[151px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#f3f4f6] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Speed Reader</p>
    </div>
  );
}

function Dashboard40() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[73px] w-[151px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">Read 3 books in a week!</p>
    </div>
  );
}

function Container141() {
  return (
    <div className="bg-[#1a0a28] col-1 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#2d1142] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Icon36 />
      <Dashboard39 />
      <Dashboard40 />
    </div>
  );
}

function Icon37() {
  return (
    <div className="absolute left-[17px] size-[24px] top-[17px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p6428280} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Dashboard41() {
  return (
    <div className="absolute h-[20px] left-[17px] top-[49px] w-[151px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#f3f4f6] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">30-Day Streak</p>
    </div>
  );
}

function Dashboard42() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[73px] w-[151px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">Read for 30 days straight</p>
    </div>
  );
}

function Container142() {
  return (
    <div className="bg-[#1a0a28] col-2 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#2d1142] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Icon37 />
      <Dashboard41 />
      <Dashboard42 />
    </div>
  );
}

function Icon38() {
  return (
    <div className="absolute left-[17px] size-[24px] top-[17px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p296ad200} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M20 3V7" id="Vector_2" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M22 5H18" id="Vector_3" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M4 17V19" id="Vector_4" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M5 18H3" id="Vector_5" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Dashboard43() {
  return (
    <div className="absolute h-[20px] left-[17px] top-[49px] w-[151px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#f3f4f6] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Genre Explorer</p>
    </div>
  );
}

function Dashboard44() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[73px] w-[151px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">Read 5 different genres</p>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[16px] relative shrink-0 w-[7.563px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">0</p>
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[16px] relative shrink-0 w-[7.422px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">5</p>
      </div>
    </div>
  );
}

function Container144() {
  return (
    <div className="content-stretch flex h-[16px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text16 />
      <Text17 />
    </div>
  );
}

function Container146() {
  return <div className="h-[6px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(99.4623deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }} />;
}

function Container145() {
  return (
    <div className="bg-[#374151] h-[6px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[151px] relative size-full">
          <Container146 />
        </div>
      </div>
    </div>
  );
}

function Dashboard45() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[26px] items-start left-[17px] top-[101px] w-[151px]" data-name="Dashboard">
      <Container144 />
      <Container145 />
    </div>
  );
}

function Container143() {
  return (
    <div className="bg-[#1a0a28] col-1 justify-self-stretch relative rounded-[14px] row-2 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#2d1142] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Icon38 />
      <Dashboard43 />
      <Dashboard44 />
      <Dashboard45 />
    </div>
  );
}

function Icon39() {
  return (
    <div className="absolute left-[17px] size-[24px] top-[17px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1dff4600} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Dashboard46() {
  return (
    <div className="absolute h-[20px] left-[17px] top-[49px] w-[151px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#f3f4f6] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">50 Books</p>
    </div>
  );
}

function Dashboard47() {
  return (
    <div className="absolute h-[16px] left-[17px] top-[73px] w-[151px]" data-name="Dashboard">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">Read 50 books in a year</p>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[16px] relative shrink-0 w-[7.727px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">4</p>
      </div>
    </div>
  );
}

function Text19() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14.977px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">50</p>
      </div>
    </div>
  );
}

function Container148() {
  return (
    <div className="content-stretch flex h-[16px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text18 />
      <Text19 />
    </div>
  );
}

function Container150() {
  return <div className="h-[6px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(153.583deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }} />;
}

function Container149() {
  return (
    <div className="bg-[#374151] h-[6px] relative rounded-[16777200px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[138.922px] relative size-full">
          <Container150 />
        </div>
      </div>
    </div>
  );
}

function Dashboard48() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[26px] items-start left-[17px] top-[101px] w-[151px]" data-name="Dashboard">
      <Container148 />
      <Container149 />
    </div>
  );
}

function Container147() {
  return (
    <div className="bg-[#1a0a28] col-2 justify-self-stretch relative rounded-[14px] row-2 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#2d1142] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Icon39 />
      <Dashboard46 />
      <Dashboard47 />
      <Dashboard48 />
    </div>
  );
}

function Dashboard38() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[__106px_minmax(0,1fr)] h-[262px] relative shrink-0 w-full" data-name="Dashboard">
      <Container141 />
      <Container142 />
      <Container143 />
      <Container147 />
    </div>
  );
}

function Container139() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[306px] items-start left-0 top-[2078.5px] w-[382px]" data-name="Container">
      <Dashboard37 />
      <Dashboard38 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#f3f4f6] text-[18px] top-[0.5px] tracking-[-0.4395px] whitespace-nowrap">March Progress</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#9ca3af] text-[12px] top-px whitespace-nowrap">{`You're on track!`}</p>
    </div>
  );
}

function Container152() {
  return (
    <div className="h-[43px] relative shrink-0 w-[135.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading6 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Dashboard49() {
  return (
    <div className="h-[43px] relative shrink-0 w-full" data-name="Dashboard">
      <div className="content-stretch flex items-start justify-between pr-[204.516px] relative size-full">
        <Container152 />
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[20px] relative shrink-0 w-[114.227px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#9ca3af] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Books Completed</p>
      </div>
    </div>
  );
}

function Text21() {
  return (
    <div className="h-[20px] relative shrink-0 w-[29.477px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#f3f4f6] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">4 / 2</p>
      </div>
    </div>
  );
}

function Container154() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text20 />
      <Text21 />
    </div>
  );
}

function Container155() {
  return <div className="h-[8px] rounded-[16777200px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(178.652deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%), linear-gradient(90deg, rgb(55, 65, 81) 0%, rgb(55, 65, 81) 100%)" }} />;
}

function Container153() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Container154 />
      <Container155 />
    </div>
  );
}

function Text22() {
  return (
    <div className="h-[20px] relative shrink-0 w-[85.547px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#9ca3af] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Reading Goal</p>
      </div>
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[20px] relative shrink-0 w-[119.93px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#f3f4f6] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">2389 / 600 pages</p>
      </div>
    </div>
  );
}

function Container157() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text22 />
      <Text23 />
    </div>
  );
}

function Container158() {
  return <div className="h-[8px] rounded-[16777200px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(178.652deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%), linear-gradient(90deg, rgb(55, 65, 81) 0%, rgb(55, 65, 81) 100%)" }} />;
}

function Container156() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Container157 />
      <Container158 />
    </div>
  );
}

function Dashboard50() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[76px] items-start relative shrink-0 w-full" data-name="Dashboard">
      <Container153 />
      <Container156 />
    </div>
  );
}

function Container151() {
  return (
    <div className="absolute bg-[#1a0a28] content-stretch flex flex-col gap-[16px] h-[177px] items-start left-0 pb-px pt-[21px] px-[21px] rounded-[16px] top-[2408.5px] w-[382px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#2d1142] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <Dashboard49 />
      <Dashboard50 />
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_600)" id="Icon">
          <path d={svgPaths.p24941500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 2.5V5.83333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 4.16667H15" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M3.33333 14.1667V15.8333" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M4.16667 15H2.5" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_1_600">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[27px] relative shrink-0 w-[126.969px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[18px] text-white top-[0.5px] tracking-[-0.4395px] whitespace-nowrap">Did You Know?</p>
      </div>
    </div>
  );
}

function Dashboard51() {
  return (
    <div className="content-stretch flex gap-[8px] h-[27px] items-center relative shrink-0 w-full" data-name="Dashboard">
      <Icon40 />
      <Heading7 />
    </div>
  );
}

function Dashboard52() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Dashboard">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[0px] text-[14px] text-[rgba(255,255,255,0.9)] top-[0.5px] tracking-[-0.1504px] w-[273px]">
        <span className="leading-[20px]">{`You've read `}</span>
        <span className="font-['Inter:Bold',sans-serif] font-bold leading-[20px]">2,389 pages</span>
        <span className="leading-[20px]">{` this year. That's equivalent to `}</span>
        <span className="font-['Inter:Bold',sans-serif] font-bold leading-[20px]">7 average novels</span>
        <span className="leading-[20px]">! 📚✨</span>
      </p>
    </div>
  );
}

function Container159() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[115px] items-start left-0 pt-[20px] px-[20px] rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] top-[2609.5px] w-[382px]" data-name="Container" style={{ backgroundImage: "linear-gradient(163.246deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Dashboard51 />
      <Dashboard52 />
    </div>
  );
}

function Icon41() {
  return (
    <div className="h-[96px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 72 88">
            <path d={svgPaths.p2f817600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Dashboard53() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[270px] opacity-10 size-[96px] top-[68px]" data-name="Dashboard">
      <Icon41 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="absolute h-[32px] left-0 top-0 w-[334px]" data-name="Heading 2">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-white top-0 tracking-[0.0703px] whitespace-nowrap">Welcome back! 📚</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[20px] left-0 top-[36px] w-[334px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.9)] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">4 books this year · Great start!</p>
    </div>
  );
}

function Icon42() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_638)" id="Icon">
          <path d={svgPaths.p874e300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 2V4.66667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.6667 3.33333H12" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 11.3333V12.6667" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M3.33333 12H2" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_1_638">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container162() {
  return (
    <div className="absolute h-[40px] left-[24px] not-italic top-0 w-[259.047px] whitespace-nowrap" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 text-[14px] text-white top-[0.5px] tracking-[-0.1504px]">Keep up the great reading momentum!</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-[rgba(255,255,255,0.8)] top-[22.5px]">{`You're on a 1-day streak 🔥`}</p>
    </div>
  );
}

function Dashboard55() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Dashboard">
      <Icon42 />
      <Container162 />
    </div>
  );
}

function Container161() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex flex-col h-[64px] items-start left-0 pt-[12px] px-[12px] rounded-[14px] top-[68px] w-[334px]" data-name="Container">
      <Dashboard55 />
    </div>
  );
}

function Dashboard54() {
  return (
    <div className="absolute h-[132px] left-[24px] top-[24px] w-[334px]" data-name="Dashboard">
      <Heading8 />
      <Paragraph2 />
      <Container161 />
    </div>
  );
}

function Container160() {
  return (
    <div className="absolute h-[180px] left-0 overflow-clip rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[166.5px] w-[382px]" data-name="Container" style={{ backgroundImage: "linear-gradient(154.77deg, rgb(255, 0, 0) 0%, rgb(16, 49, 198) 100%)" }}>
      <Dashboard53 />
      <Dashboard54 />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="relative size-full" data-name="Dashboard">
      <ThemePicker />
      <ReadingStories />
      <Container66 />
      <Container71 />
      <Container100 />
      <Container110 />
      <Container131 />
      <Container139 />
      <Container151 />
      <Container159 />
      <Container160 />
    </div>
  );
}