import { Component, OnInit } from "@angular/core";
import { ToasterService } from "angular2-toaster";
import { DialogRef, ModalComponent } from "ngx-modialog";
import { NebBotConfigurationDialogContext } from "../config-context";
import { AdminNebApiService } from "../../../../shared/services/admin/admin-neb-api.service";
import { FE_NebConfiguration } from "../../../../shared/models/admin-responses";
import { FE_Integration } from "../../../../shared/models/integration";
import { TranslateService } from "@ngx-translate/core";

interface ImgurConfig {
    client_id: string;
    client_secret: string;
}

@Component({
    templateUrl: "./imgur.component.html",
    styleUrls: ["./imgur.component.scss", "../config-dialog.scss"],
})
export class AdminNebImgurConfigComponent implements ModalComponent<NebBotConfigurationDialogContext>, OnInit {

    public isLoading = true;
    public isUpdating = false;
    public config: ImgurConfig;
    public integration: FE_Integration;
    public neb: FE_NebConfiguration;

    constructor(public dialog: DialogRef<NebBotConfigurationDialogContext>,
                private adminNebApi: AdminNebApiService,
                private toaster: ToasterService,
                public translate: TranslateService) {
        this.translate = translate;
        this.neb = dialog.context.neb;
        this.integration = dialog.context.integration;
    }

    public ngOnInit() {
        this.adminNebApi.getIntegrationConfiguration(this.neb.id, this.integration.type).then(config => {
            this.config = config;
            this.isLoading = false;
        }).catch(err => {
            console.error(err);
            this.translate.get('Error loading configuration').subscribe((res: string) => {this.toaster.pop("error", res); });
        });
    }

    public save() {
        this.isUpdating = true;
        this.adminNebApi.setIntegrationConfiguration(this.neb.id, this.integration.type, this.config).then(() => {
            this.translate.get('Configuration updated').subscribe((res: string) => {this.toaster.pop("success", res); });
            this.dialog.close();
        }).catch(err => {
            this.isUpdating = false;
            console.error(err);
            this.translate.get('Error updating integration').subscribe((res: string) => {this.toaster.pop("error", res); });
        });
    }
}
