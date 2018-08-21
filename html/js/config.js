const API_ENROL = "enrol";
const API_VERIFY = "verify";
const API_CROSS_MATCH = "cross_match";
const API_CHECK_QUALITY = "check_quality";
const API_DELETE = "delete";

const MODES = [API_ENROL, API_VERIFY, API_CROSS_MATCH];
const MENU = ["Enrol", "Verify", "Identify"];
var mode;
var isGood;
var phrase;

// steps
const STEP_MAIN = "menu";
const STEP_INPUT = "input";
const STEP_MOBILE = "mobile";
const STEP_RANDOM = "random";
const STEP_DIGIT_ASC = "digit_asc";
const STEP_DIGIT_DESC = "digit_desc";
const STEP_CHECK_QUALITY = API_CHECK_QUALITY;
const STEP_ENROL = API_ENROL;
const STEP_VERIFY = API_VERIFY;
const STEP_CROSS_MATCH = API_CROSS_MATCH;
const STEP_COMPLETE = "complete";
const STEP_RETRY = "retry";
const STEP_API_ERROR = "api_error";

// api
const SERVER = "https://cloud.armorvox.com/evaluation/v6/";
const GROUP = "your_group_name";
const VOCAB = "en_digits";
const QA_MODE = API_ENROL;
const PN_MOBILE = "digit-mobile";
const PN_RANDOM = "digit-random";
const THRESH_IMP_PROB = 0.25

// used by getNextStep()
var step;
var routes = new Map(); // routes are set within main::init()

// contact
var name;
var mobile;
var email;

// api
var printName;
var utterances = [];
var list;

// effect
var divNumberDisplay;
var divButtonDisplay;
var curProgress;
var maxProgress;
