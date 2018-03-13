//
//  CMSRN.m
//  CMSRN
//
//  Created by Chris on 08/02/2018.
//  Copyright © 2018 CMSRN. All rights reserved.
//

#import "CMSFrameworkModule.h"
#import "React/RCTConvert.h"
#import <EventKit/EventKit.h>
#import <Call1/Call1.h>
#import <Call1/CallOne.h>
#define CMSEVENT @"CMSEVENT"
@interface CMSFrameworkModule ()<CallOneDelegate>
@property (nonatomic,retain) CallOne * call1;
@property (nonatomic,retain) NSArray * PinPads;
@end

@implementation CMSFrameworkModule
@synthesize call1;
RCT_EXPORT_MODULE();
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"CMSEVENT"];
}
RCT_EXPORT_METHOD(initFramework:(NSString *)token)
{
    RCTLogInfo(@"initing doc %@",token);
    
     call1 =[[CallOne alloc] initwith:token fromServer:@"" Delegate:self];
}


RCT_EXPORT_METHOD(getVersion)
{
 NSString*version= [CallOne CMSversion];
    [self sendEventWithName:@"CMSEVENT" body:@{@"frameworkversion":version}];
}

RCT_EXPORT_METHOD(selectDevice:(NSString *)name)
{
  RCTLogInfo(@"select pinpad %@", name);
  NSError *err;
  [call1 selectPinPad:name configurationError:&err];
}
RCT_EXPORT_METHOD(connectPinpad)
{
  RCTLogInfo(@"connectPinpad");
  NSError *err;
  [call1 connectPinPad:&err];
  if (err.code!=0)
  {
  
      NSString * errstr=[self geterrorString:err.code];
    NSDictionary *errordic=@{@"error"  :errstr};
    [self sendEventWithName:@"CMSEVENT" body:@{@"pinPadConnectionCompleted":[self genJSONFrom:errordic]}];
    return;
  }
}

RCT_EXPORT_METHOD(getBTList)
{
   RCTLogInfo(@"getBT");
 NSArray* array= [call1 getPinpadList];
  if ([array isKindOfClass:[NSArray class]] && array.count > 0)
  {
    
    
   
    [self sendEventWithName:CMSEVENT body:@{@"pinpads": array}];
  }else{
    NSMutableDictionary * pinpads= [[NSMutableDictionary alloc]init];
    [pinpads setObject:@"No BT DEVICE" forKey:@"error"];
    
    [self sendEventWithName:CMSEVENT body:@{@"pinpads":[self genJSONFrom:pinpads]}];
  }
 
}

RCT_EXPORT_METHOD(processSale:(NSString*)req)
{
    RCTLogInfo(@"processSale %@",req);
  NSDictionary * reqDict= [self dictionaryWithJsonString:req];
  NSError *err;
  [call1 processSale:reqDict withError:&err];
  if (err.code!=0)
  {
      NSString * errstr=[self geterrorString:err.code];
    NSDictionary *errordic=@{@"error"  :errstr};
    [self sendEventWithName:@"CMSEVENT" body:@{@"transactionSaleCompleted":[self genJSONFrom:errordic]}];
    return;
  }
}
RCT_EXPORT_METHOD(processAuth:(NSString*)req)
{
  RCTLogInfo(@"processAuth %@",req);
  NSDictionary * reqDict= [self dictionaryWithJsonString:req];
  NSError *err;
  [call1 processAuthorization:reqDict withError:&err];
  if (err.code!=0)
  {
NSString * errstr=[self geterrorString:err.code];
      NSDictionary *errordic=@{@"error"  :errstr};
    [self sendEventWithName:@"CMSEVENT" body:@{@"transAuthorizationCompleted":[self genJSONFrom:errordic]}];
    return;
  }
}
RCT_EXPORT_METHOD(signatureVerified:(BOOL)res)
{
  [call1 signatureVerified:res];

}
RCT_EXPORT_METHOD(phoneReferral:(NSString*)req)//need test later
{
  RCTLogInfo(@"phoneReferral %@",req);
  NSDictionary * reqDict= [self dictionaryWithJsonString:req];
 NSString*result= [reqDict objectForKey:@"result"];
  NSString *auth=[reqDict objectForKey:@"authcode"];
  BOOL s;
  if([result isEqualToString:@"true"])
  {
    s=YES;
  }
  else{
    s=NO;
  }
  [call1 phoneReferral:s withAuthcode:auth];
  
}
RCT_EXPORT_METHOD(processCapture:(NSString*)req)
{
  RCTLogInfo(@"processCapture %@",req);
  NSDictionary * reqDict= [self dictionaryWithJsonString:req];
  NSError *err;
  [call1 processCapture:reqDict withError:&err];
  if (err.code!=0)
  {
      NSString * errstr=[self geterrorString:err.code];
      NSDictionary *errordic=@{@"error"  :errstr};
    [self sendEventWithName:@"CMSEVENT" body:@{@"transAuthorizationCompleted":[self genJSONFrom:errordic]}];
    return;
  }
}
RCT_EXPORT_METHOD(processVoid:(NSString*)req)
{
  RCTLogInfo(@"processVoid %@",req);
  NSDictionary * reqDict= [self dictionaryWithJsonString:req];
  NSError *err;
  [call1 processVoid:reqDict withError:&err];
  if (err.code!=0)
  {
      NSString * errstr=[self geterrorString:err.code];
      NSDictionary *errordic=@{@"error"  :errstr};
    [self sendEventWithName:@"CMSEVENT" body:@{@"transAuthorizationCompleted":[self genJSONFrom:errordic]}];
    return;
  }
}
RCT_EXPORT_METHOD(processReturn:(NSString*)req)
{
  RCTLogInfo(@"processReturn %@",req);
  NSDictionary * reqDict= [self dictionaryWithJsonString:req];
  NSError *err;
  [call1 processReturn:reqDict withError:&err];
  if (err.code!=0)
  {
      
      NSString * errstr=[self geterrorString:err.code];
      NSDictionary *errordic=@{@"error"  :errstr};
    [self sendEventWithName:@"CMSEVENT" body:@{@"transactionReturnCompleted":[self genJSONFrom:errordic]}];
    return;
  }
}
RCT_EXPORT_METHOD(tmsupdate)
{
  RCTLogInfo(@"tmsupdate");
  
  NSError *err;
  [call1 TMSupdate:&err];
  if (err.code!=0)
  {
     NSString * errstr=[self geterrorString:err.code];
      NSDictionary *errordic=@{@"error"  :errstr};
    [self sendEventWithName:@"CMSEVENT" body:@{@"TMSupdateCompleted":[self genJSONFrom:errordic]}];
    return;
  }
}
- (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString
{
  if (jsonString == nil) {
    return nil;
  }
  
  NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  NSError *err;
  NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                      options:NSJSONReadingMutableContainers
                                                        error:&err];
  if(err)
  {
    NSLog(@"jsonfailure：%@",err);
    return nil;
  }
  return dic;
}
-(NSString*)genJSONFrom:(NSDictionary *)dict
{
  NSError *err;//= [NSError alloc];
  NSData * jsonData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:&err];
  if ([jsonData length] == 0 || err != nil) {
    return nil;
  }
  NSLog(@"%@",jsonData);
  NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  jsonString= [jsonString stringByReplacingOccurrencesOfString:@" " withString:@""];
  jsonString= [jsonString stringByReplacingOccurrencesOfString:@"\r" withString:@""];
  jsonString= [jsonString stringByReplacingOccurrencesOfString:@"\n" withString:@""];
  return jsonString;
}

-(NSString*)geterrorString:(CALLERRORList)error
{
    switch (error) {
        case CALLERRORListNOError:
            return @"CALLERRORListNOError";
        case CALLNOPUBKEYERROR:
            return @"CALLNOPUBKEYERROR";
        case CALLERRORListinitHTTPError:
            return @"CALLERRORListinitHTTPError";
        case CALLERRORListinitHTTPNONetwork:return @"CALLERRORListinitHTTPNONetwork";
        case CALLERRORListUnknow:return @"CALLERRORListUnknow";
        case CALLApplicationUpdateRequired:return @"CALLApplicationUpdateRequired";
        case CALLInvalidHomeNetworkIdentity:return @"CALLApplicationUpdateRequired";
        case CALLTerminalDisabled:return @"CALLTerminalDisabled";
        case CALLTransactionTypeNotSupported:return @"CALLTransactionTypeNotSupported";
        case CALLNoCompletedTransaction:return @"CALLNoCompletedTransaction";
        case CALLAnotherOperationBeingProcessed:return @"CALLNoCompletedTransaction";
        case CALLPinPadAlreadyConnected:return @"CALLPinPadAlreadyConnected";
        case CALLPinPadNotConnected:return @"CALLPinPadNotConnected";
        case CALLUpdateNotConfigured:return @"CALLUpdateNotConfigured";
        //case CALLTMSUpdateRequired:return @"CALLTMSUpdateRequired";
        case CALLStandaloneRefundNotSupported:return @"CALLStandaloneRefundNotSupported";
        case  CALLLinkedRefundNotSupported:return @"CALLLinkedRefundNotSupported";
        case CALLCashTransactionsNotSupported:return @"CALLCashTransactionsNotSupported";
        case  CALLChequeTransactionsNotSupported:return @"CALLChequeTransactionsNotSupported";
            //1017
        case CALLGratuityNotSupported:return @"CALLGratuityNotSupported";
        case  CALLCurrencyNotFound:return @"CALLCurrencyNotFound";
        case CALLCurrencyNotSet:return @"CALLCurrencyNotSet";
        case CALLCurrencyNotSupportedForPaymentMethod:return @"CALLCurrencyNotSupportedForPaymentMethod";
        case CALLEndOfDayTippingNotSupported:return @"CALLEndOfDayTippingNotSupported";
        case CALLOnDeviceTippingNotSupported:return @"CALLEndOfDayTippingNotSupported";
        case CALLPinPadeckRequired:return @"CALLPinpadcheckRequired";
        case CALLTMSUpdateRequired:return @"CALLPinPadTMSRequired";
        case CALLSREDKeyRequired:return @"CALLSREDKeyRequired";
        case CALLUnableToOpenURL:return @"CALLUnableToOpenURL";
        case CALLUnableToSpecifyCommunicationProtocol:return @"CALLUnableToSpecifyCommunicationProtocol";
        case CALLUnableToSendRequest:return @"CALLUnableToSendRequest";
        case CALLUnableToGetHttpResponseCode:return @"CALLUnableToGetHttpResponseCode";
        case CALLUnsuccessfulHttpRequest:return @"CALLUnsuccessfulHttpRequest";
        case CALLUnableToReadResponse:return @"CALLUnableToReadResponse";
        case CALLUnableToRetrieveResponse:return @"CALLUnableToRetrieveResponse";
        case CALLUnableToWriteRequestXml:return @"CALLUnableToWriteRequestXml";
        case CALLUnableToParseResponseXml:return @"CALLUnableToParseResponseXml";
        case CALLUnableToReadResponseXml:return @"CALLUnableToReadResponseXml";
        case CALLErrorParsingResponseXml:return @"CALLErrorParsingResponseXml";
        case CALLResponseXmlNotFound:return @"CALLResponseXmlNotFound";
        case CALLEmptyPropertySet:return @"CALLEmptyPropertySet";
        case CALLErrorParsingPropertyXML:return @"CALLErrorParsingPropertyXML";
        case CALLPinpadNotConfigured:return @"CALLPinpadNotConfigured";
        case CALLSpecifiedUrlMalformed:return @"CALLPinpadNotConfigured";
        case CALLDeviceNotPaired:return @"CALLDeviceNotPaired";
        case CALLBluetoothNotSupported:return @"CALLBluetoothNotSupported";
        case CALLNoDeviceSelected:return @"CALLBluetoothNotSupported";
        case CALLConnectionFailed:return @"CALLConnectionFailed";
        case CALLBluetoothNotEnabled:return @"CALLBluetoothNotEnabled";
        case CALLDeviceNotPairedAndConnected:return @"CALLDeviceNotPairedAndConnected";
        case CALLUnsupportedCommunicationProtocol:return @"CALLUnsupportedCommunicationProtocol";
            
        case CALLServerCommunicationError:return @"CALLServerCommunicationError";
        case CALLServerRequestError:return @"CALLServerRequestError";
        case CALLServerResponseError:return @"CALLServerResponseError";
        case CALLNoResponseFromServer:return @"CALLNoResponseFromServer";
        case CALLAmountInvalid:return @"CALLAmountInvalid";
        case CALLAmountMissing:return @"CALLAmountMissing";
        case CALLAmountTooLarge:return @"CALLAmountTooLarge";
        case CALLAmountTooSmall:return @"CALLAmountTooSmall";
        case CALLCardBanned:return @"CALLCardBanned";
        case CALLCardDetailsNotFound:return @"CALLCardDetailsNotFound";
        case CALLCardDetailsUnavailable:return @"CALLCardDetailsUnavailable";
        case CALLReferenceInvalid:return @"CALLReferenceInvalid";
        case CALLReferenceMissing:return @"CALLReferenceMissing";
        case CALLCardHashInvalid:return @"CALLCardHashInvalid";
        case CALLCardReferenceInvalid:return @"CALLCardReferenceInvalid";
        case CALLCardSchemeNotSupported:return @"CALLCardSchemeNotSupported";
        case CALLCardUsageExceeded:return @"CALLCardUsageExceeded";
        case CALLExpiredCard:return @"CALLExpiredCard";
        case CALLExpiryDateInvalid:return @"CALLExpiryDateInvalid";
        case CALLExpiryDateMissing:return @"CALLExpiryDateMissing";
        case CALLInvalidData:return @"CALLInvalidData";
        case CALLInvalidMessageType:return @"CALLInvalidMessageType";
        case CALLInvalidXMLRequest:return @"CALLInvalidXMLRequest";
        case CALLIssueNoInvalid:return @"CALLIssueNoInvalid";
        case CALLIssueNoMissing:return @"CALLIssueNoMissing";
        case CALLMessageTypeInvalid:return @"CALLMessageTypeInvalid";
        case CALLMessageTypeMissing:return @"CALLMessageTypeMissing";
        case CALLNotAllowed:return @"CALLNotAllowed";
        case CALLPANFailsLuhnCheck:return @"CALLPANFailsLuhnCheck";
        case CALLPANInvalid:return @"CALLPANInvalid";
        case CALLPANMissing:return @"CALLPANMissing";
        case CALLPANTooLong:return @"CALLPANTooLong";
        case CALLPANTooShort:return @"CALLPANTooShort";
        case CALLPreValidCard:return @"CALLPreValidCard";
        case CALLStartDateInvalid:return @"CALLStartDateInvalid";
        case CALLStartDateMissing:return @"CALLStartDateMissing";
        case CALLTemporarilyUnavailable:return @"CALLTemporarilyUnavailable";
        case CALLTerminalIDDisabled:return @"CALLTerminalIDDisabled";
        case TCALLerminalIDInvalid:return @"TCALLerminalIDInvalid";
        case CALLTerminalIDMissing:return @"CALLTerminalIDMissing";
        case CALLTerminalIDUnknown:return @"CALLTerminalIDUnknown";
        case CALLTerminalUsageExceeded:return @"CALLTerminalUsageExceeded";
        case CALLTransactionAlreadyRefunded:return @"CALLTransactionAlreadyRefunded";
        case CALLTransactionAlreadySettled:return @"CALLTransactionAlreadySettled";
        case CALLTransactionAlreadyVoided:return @"CALLTransactionAlreadyVoided";
        case CALLTransactionKeyIncorrect:return @"CALLTransactionKeyIncorrect";
        case CALLTransactionKeyInvalid:return @"CALLTransactionKeyInvalid";
        case CALLTransactionKeyMissing:return @"CALLTransactionKeyMissing";
        case CALLTransactionNotFound:return @"CALLTransactionNotFound";
        case CALLTransactionOriginallyDeclined:return @"CALLTransactionOriginallyDeclined";
        case CALLTransactionNotCommitted:return @"CALLTransactionNotCommitted";
        case CALLXMLDecryptionError:return @"CALLXMLDecryptionError";
        case CALLXMLElementMissing:return @"CALLXMLElementMissing";
        case CALLUnableToStartPinpadTransaction:return @"CALLUnableToStartPinpadTransaction";
        case CALLUnableToInitialisePinpad:return @"CALLUnableToInitialisePinpad";
        case CALLUnableToStartPinpadProcess:return @"CALLUnableToStartPinpadProcess";
        case CALLFailedToTransmitPinpadMessage:return @"CALLFailedToTransmitPinpadMessage";
        case CALLPinpadConnectionClosed:return @"CALLPinpadConnectionClosed";
        case CALLUnknownRequestFromPinpad:return @"CALLUnknownRequestFromPinpad";
        case CALLUnexpectedRequestFromPinpad:return @"CALLUnexpectedRequestFromPinpad";
        case CALLTerminalConfigurationError:return @"CALLTerminalConfigurationError";
        case CALLInvalidIssuerResponse:return @"CALLInvalidIssuerResponse";
        case CALLInvalidPinpadRefundResult:return @"CALLInvalidPinpadRefundResult";
        case CALLPinpadTransactionTerminated:return @"CALLPinpadTransactionTerminated";
        case CALLChipApplicationSelectionFailure:return @"CALLChipApplicationSelectionFailure";
        case CALLChipInitiateApplicationProcessingFailure:return @"CALLChipInitiateApplicationProcessingFailure";
        case CALLChipReadApplicationDataFailure:return @"CALLChipReadApplicationDataFailure";
        case CALLChipOfflineDataAuthenticationFailure:return @"CALLChipOfflineDataAuthenticationFailure";
        case CALLChipProcessRestrictionsFailure:return @"CALLChipProcessRestrictionsFailure";
        case CALLChipTerminalRiskManagementFailure:return @"CALLChipTerminalRiskManagementFailure";
        case CALLChipCardholderVerificationMethodFailure:return @"CALLChipCardholderVerificationMethodFailure";
        case CALLChipTerminalActionAnalysisFailure:return @"CALLChipTerminalActionAnalysisFailure";
        case CALLChipCardActionAnalysisFailure:return @"CALLChipCardActionAnalysisFailure";
        case CALLChipCompletionFailure:return @"CALLChipCompletionFailure";
        case CALLEposTransactionTerminated:return @"CALLEposTransactionTerminated";
        case CALLChipNoAnswerToReset:return @"CALLChipNoAnswerToReset";
        case CALLSwipeReadFailure:return @"CALLSwipeReadFailure";
        case CALLChipCardRemoved:return @"CALLChipCardRemoved";
        case CALLPinpadUserCancelled:return @"CALLPinpadUserCancelled";
        case CALLChipNoSupportedApplications:return @"CALLChipNoSupportedApplications";
        case CALLChipCardBlocked:return @"CALLChipCardBlocked";
        case CALLChipReadFailure:return @"CALLChipReadFailure";
        case CALLApplicationNotSupported:return @"CALLApplicationNotSupported";
        case CALLVoiceReferralNotificationError:return @"CALLVoiceReferralNotificationError";
        case CALLOfflineIccAuthorisationError:return @"CALLOfflineIccAuthorisationError";
        case CALLAtmCashOnlyCard:return @"CALLAtmCashOnlyCard";
        case CALLCardHolderActionTimedOut:return @"CALLCardHolderActionTimedOut";
        case CALLPinpadDukptKeyFailure:return @"CALLPinpadDukptKeyFailure";
        case CALLInvalidDataInCommandError:return @"CALLInvalidDataInCommandError";
        case CALLTerminalNotReadyError:return @"CALLTerminalNotReadyError";
        case CALLNoSmartcardInSlotError:return @"CALLNoSmartcardInSlotError";
        case CALLInvalidCardResponseError:return @"CALLInvalidCardResponseError";
        case CALLTransactionAlreadyInProgressError:return @"CALLTransactionAlreadyInProgressError";
        case CALLMissingDataInCommandError:return @"CALLMissingDataInCommandError";
        case CALLMissingFileError:return @"CALLMissingFileError";
        case CALLInvalidIssuerPublicKeyError:return @"";
        case CALLTestCheckError:return @"CALLTestCheckError";
        case CALLGeneralEMVError:return @"CALLGeneralEMVError";
        case CALLCardBlockedError:return @"CALLCardBlockedError";
        case CALLTimeOutError:return @"CALLTimeOutError";
        case CALLTransactionAbortedError:return @"CALLTransactionAbortedError";
        case CALLConfigurationError:return @"CALLConfigurationError";
        case CALLInvalidApplicationError:return @"CALLInvalidApplicationError";
        case CALLPINError:return @"CALLPINError";
        case CALLOperatorPinIncorrect :return@"CALLOperatorPinIncorrect";
        case CALLOfflineRequestTooOld:return @"CALLOfflineRequestTooOld";
        case CALLTimeOutErrorContactless:return @"CALLTimeOutErrorContactless";
        case CALLContactlessHardwareError:return @"CALLContactlessHardwareError";
        case CALLNoInterfacesEnabled:return @"CALLNoInterfacesEnabled";
        case CALLMagstripeInterfaceNotEnabled:return @"CALLMagstripeInterfaceNotEnabled";
        case CALLEMVInterfaceNotEnabled:return @"CALLEMVInterfaceNotEnabled";
        case CALLMagstripeInterfaceNotEnabledEMVFallbackNotPossible:return @"CALLMagstripeInterfaceNotEnabledEMVFallbackNotPossible";
        case CALLEMVAndMagstripeInterfacesNotEnabledContactlessFallForwardNotPossible:return @"CALLEMVAndMagstripeInterfacesNotEnabledContactlessFallForwardNotPossible";
        case CALLEMVInterfaceNotEnabledContactlessFallbackNotPossible:return @"CALLEMVInterfaceNotEnabledContactlessFallbackNotPossible";
        case CALLOnlinePINInternalError1:return @"CALLOnlinePINInternalError1";
        case CALLOnlinePINInternalError2:return @"CALLOnlinePINInternalError2";
        case CALLOnlinePINInternalError3:return @"CALLOnlinePINInternalError3";
        case CALLOnlinePINKeyMissingForMagstripeDebit:return @"CALLOnlinePINKeyMissingForMagstripeDebit";
        //case CALLTransactionTenderInvalid:return @"CALLTransactionTenderInvalid";
        //case CALLMerchantTerminateTransaction:return @"CALLMerchantTerminateTransaction";
            
    }
    return [NSString stringWithFormat:@"%ld",error];
}

- (void)PinpadconnectionComplete:(NSError *)error {
RCTLogInfo(@"PinpadconnectionComplete %@",error.description);
  if (error.code!=0)
  {
      NSString * errstr=[self geterrorString:error.code];
      NSDictionary *errordic=@{@"error"  :errstr};
    [self sendEventWithName:@"CMSEVENT" body:@{@"pinPadConnectionCompleted": errordic.description}];
    return;
  }
  [self sendEventWithName:@"CMSEVENT" body:@{@"pinPadConnectionCompleted": @"success"}];
}

- (void)TMSupdateComplete:(NSError *)error {
  RCTLogInfo(@"TMSupdateComplete %@",error.description);
  if (error.code!=0)
  {
      NSString * errstr=[self geterrorString:error.code];
      NSDictionary *errordic=@{@"error"  :errstr};
    [self sendEventWithName:@"CMSEVENT" body:@{@"TMSupdateCompleted": errordic.description}];
    return;
  }
  [self sendEventWithName:@"CMSEVENT" body:@{@"TMSupdateCompleted": @"success"}];

}

- (void)initialisCompleted:(BOOL)ready withError:(NSError *)error {
    NSLog(@"APP Completed %@",error.description);
  if (error.code!=0)
  {
     NSString * errstr=[self geterrorString:error.code];
      NSDictionary *errordic=@{@"error"  :errstr};
    [self sendEventWithName:@"CMSEVENT" body:@{@"initCompleted": errordic.description}];
    return;
  }
  [self sendEventWithName:@"CMSEVENT" body:@{@"initCompleted": @"success"}];
   
}

- (void)transAuthorizationCompleted:(NSDictionary *)resultDict {
  RCTLog(@"transAuthorizationCompleted %@",resultDict.description);
  if([resultDict objectForKey:@"error"] !=nil)
  {
    NSString *errorstr= [resultDict objectForKey:@"error"];
    NSString * errormean= [self geterrorString: [errorstr integerValue]];
    NSDictionary * errdict=@{@"error":errormean};
    [self sendEventWithName:@"CMSEVENT" body:@{@"transAuthorizationCompleted": [self genJSONFrom:errdict]}];
    return;
  }
  [self sendEventWithName:@"CMSEVENT" body:@{@"transAuthorizationCompleted": [self genJSONFrom:resultDict]}];
}

- (void)transactionCaptureCompleted:(NSDictionary *)resultDict {
  RCTLog(@"transactionCaptureCompleted %@",resultDict.description);
  if([resultDict objectForKey:@"error"] !=nil)
  {
    NSString *errorstr= [resultDict objectForKey:@"error"];
    NSString * errormean= [self geterrorString: [errorstr integerValue]];
    NSDictionary * errdict=@{@"error":errormean};
    [self sendEventWithName:@"CMSEVENT" body:@{@"transactionCaptureCompleted": [self genJSONFrom:errdict]}];
    return;
  }
  [self sendEventWithName:@"CMSEVENT" body:@{@"transactionCaptureCompleted": [self genJSONFrom:resultDict]}];
}

- (void)transactionReturnCompleted:(NSDictionary *)resultDict {
  RCTLog(@"transactionReturnCompleted %@",resultDict.description);
  if([resultDict objectForKey:@"error"] !=nil)
  {
    NSString *errorstr= [resultDict objectForKey:@"error"];
    NSString * errormean= [self geterrorString: [errorstr integerValue]];
    NSDictionary * errdict=@{@"error":errormean};
    [self sendEventWithName:@"CMSEVENT" body:@{@"transactionReturnCompleted": [self genJSONFrom:errdict]}];
    return;
  }
  [self sendEventWithName:@"CMSEVENT" body:@{@"transactionReturnCompleted": [self genJSONFrom:resultDict]}];
}

- (void)transactionSaleCompleted:(NSDictionary *)resultDict {
  RCTLog(@"transactionSaleCompleted %@",resultDict.description);
  if([resultDict objectForKey:@"error"] !=nil)
  {
    NSString *errorstr= [resultDict objectForKey:@"error"];
    NSString * errormean= [self geterrorString: [errorstr integerValue]];
    NSDictionary * errdict=@{@"error":errormean};
    [self sendEventWithName:@"CMSEVENT" body:@{@"transactionSaleCompleted": [self genJSONFrom:errdict]}];
    return;
  }
    [self sendEventWithName:@"CMSEVENT" body:@{@"transactionSaleCompleted": [self genJSONFrom:resultDict]}];
    
}

- (void)transactionVoidCompleted:(NSDictionary *)resultDict {
  RCTLog(@"transactionVoidCompleted %@",resultDict.description);
  if([resultDict objectForKey:@"error"] !=nil)
  {
    NSString *errorstr= [resultDict objectForKey:@"error"];
    NSString * errormean= [self geterrorString: [errorstr integerValue]];
    NSDictionary * errdict=@{@"error":errormean};
    [self sendEventWithName:@"CMSEVENT" body:@{@"transactionVoidCompleted": [self genJSONFrom:errdict]}];
    return;
  }
  [self sendEventWithName:@"CMSEVENT" body:@{@"transactionVoidCompleted": [self genJSONFrom:resultDict]}];
}

- (void)verifySignature:(BOOL)notifyflg {
  RCTLog(@"verifySignature %d",notifyflg);
  NSString *notifystr;
  if (notifyflg)
  {
    notifystr=@"true";
  }
  else
  {
    notifystr=@"false";
  }
  [self sendEventWithName:@"CMSEVENT" body:@{@"verifySignature": notifystr}];
}

- (void)voiceReferral:(BOOL)notifyflg withphone:(NSString *)phoneNumber {//need test
  NSString *notifystr;
  if (notifyflg)
  {
    notifystr=@"true";
  }
  else
  {
    notifystr=@"false";
  }
  NSDictionary *resDict=@{@"notifyflg":notifystr,@"phoneNumber":phoneNumber};
  [self sendEventWithName:@"CMSEVENT" body:@{@"voiceReferral":[self genJSONFrom:resDict]}];
}

-(void)confirmCardinfo:(NSDictionary *)cardinfo
{
   [self sendEventWithName:@"CMSEVENT" body:@{@"confirmCardinfo":[self genJSONFrom:cardinfo]}];
}
-(void)Pinpaddisattached
{
   [self sendEventWithName:@"CMSEVENT" body:@{@"Pinpaddisattached": @"true"}];
}
-(void)Pinpadattached
{
   [self sendEventWithName:@"CMSEVENT" body:@{@"Pinpadattached": @"true"}];
}
-(void)transactionMessageUpdate:(NSString *) msg
{
    NSString * lg=[NSString stringWithFormat:@"transactionMessageUpdate%@",msg];
    RCTLog(@"%@",lg);
  [self sendEventWithName:@"CMSEVENT" body:@{@"transactionMessageUpdate": msg}];
}
-(void)EMVApplicationList:(NSArray *)applications
{
  
}


@end
