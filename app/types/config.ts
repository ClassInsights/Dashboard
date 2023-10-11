type Config = {
  teacherGroup: string;
  domainSid: string;
  domainName: string;
  caSubject: string;
  schoolYear: {
    name: string;
    startDate: Date;
    endDate: Date;
  };
  azureGroupPattern: string;
};

export default Config;
