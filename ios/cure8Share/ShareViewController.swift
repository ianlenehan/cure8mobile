//
//  ShareViewController.swift
//  cure8Share
//
//  Created by Ian Lenehan on 25/1/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import Social
import MobileCoreServices

class ShareViewController: SLComposeServiceViewController {
  
  var urlToPost : String = "something"
  var token : String = "none"

    override func isContentValid() -> Bool {
        // Do validation of contentText and/or NSExtensionContext attachments here
        return true
    }

  override func didSelectPost() {
        // This is called after the user selects Post. Do the upload of contentText and/or NSExtensionContext attachments.
        postToApi()
        // Inform the host that we're done, so it un-blocks its UI. Note: Alternatively you could call super's -didSelectPost, which will similarly complete the extension context.
        self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
    }

    override func configurationItems() -> [Any]! {
        // To add configuration options via table cells at the bottom of the sheet, return an array of SLComposeSheetConfigurationItem here.
        return []
    }
  
    override func viewDidLoad() {
      let defaults = UserDefaults.standard
      let name = defaults.string(forKey: "authToken")
      if let userDefaults = UserDefaults(suiteName: "group.cure8.cure8app") {
        let value1 = userDefaults.string(forKey: "authToken")
        print("retrieved token value\(value1)")
      } else {
        print("no token value")
      }
      
      let extensionItem = extensionContext?.inputItems.first as! NSExtensionItem
      let itemProvider = extensionItem.attachments?.first as! NSItemProvider
      let propertyList = String(kUTTypePropertyList)
      if itemProvider.hasItemConformingToTypeIdentifier(propertyList) {
        itemProvider.loadItem(forTypeIdentifier: propertyList, options: nil, completionHandler: { (item, error) -> Void in
          guard let dictionary = item as? NSDictionary else { return }
          OperationQueue.main.addOperation {
            if let results = dictionary[NSExtensionJavaScriptPreprocessingResultsKey] as? NSDictionary,
              let urlString = results["URL"] as? String,
              let url = NSURL(string: urlString) {
              self.urlToPost = urlString
              print("URL retrieved: \(url)")
            }
          }
        })
      } else {
        print("error")
      }
    }
  
  func postToApi() {
    let url = URL(string: "https://cure8.herokuapp.com/api/v1/links/share_extension")
//    let url = URL(string: "http://localhost:3000/api/v1/links/share_extension")
    var request = URLRequest(url: url!)
    request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
    request.httpMethod = "POST"
    
    let postString = "phone=+61410872627&url=\(urlToPost)"
    request.httpBody = postString.data(using: .utf8)
    
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {                                                 // check for fundamental networking error
        print("error=\(String(describing: error))")
        return
      }
      
      if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode != 200 {           // check for http errors
        print("statusCode should be 200, but is \(httpStatus.statusCode)")
        print("response = \(String(describing: response))")
      }
      
      let responseString = String(data: data, encoding: .utf8)
      print("responseString = \(String(describing: responseString))")
    }
    task.resume()
      
    print("URL is: \(postString)")
  }

}
