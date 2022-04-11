package edu.brynmawr.cmsc353.webapp;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.TextView;

import org.parceler.Parcels;

import edu.brynmawr.cmsc353.webapp.models.Hospital;

public class DetailsActivity extends AppCompatActivity {
    protected TextView tvDetailsName;
    protected TextView tvAddress;
    protected TextView tvPhone;
    protected TextView tvCapacity;
    protected TextView tvNew;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_details);

        tvDetailsName = findViewById(R.id.tvDetailsName);
        tvAddress = findViewById(R.id.tvAddress);
        tvPhone = findViewById(R.id.tvPhone);
        tvCapacity = findViewById(R.id.tvCapacity);
        tvNew = findViewById(R.id.tvNew);
        handleParcel();
    }

    private void handleParcel() {
        Hospital hospital = (Hospital) Parcels.unwrap(getIntent().getParcelableExtra("hospital"));
        String name = hospital.getName();
        tvDetailsName.setText(name);
        tvAddress.setText(hospital.getAddress());
        tvPhone.setText(hospital.getPhone());
        tvCapacity.setText(Integer.toString(hospital.getCapacity()));
        if(hospital.isAcceptsNew()){
            tvNew.setText("YES");
        }
        else{
            tvNew.setText("NO");
        }
    }
}