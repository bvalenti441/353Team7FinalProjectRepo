package edu.brynmawr.cmsc353.webapp.adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.parceler.Parcels;

import java.util.List;

import edu.brynmawr.cmsc353.webapp.DetailsActivity;
import edu.brynmawr.cmsc353.webapp.R;
import edu.brynmawr.cmsc353.webapp.models.Hospital;

public class HospitalAdapter extends
        RecyclerView.Adapter<HospitalAdapter.ViewHolder> {

    Context context;
    List<Hospital> hospitals;

    public HospitalAdapter(Context context, List<Hospital> hospitals) {
        this.context = context;
        this.hospitals = hospitals;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_hospital,parent,false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Hospital hospital = hospitals.get(position);
        holder.bind(hospital);
    }

    @Override
    public int getItemCount() {
        return hospitals.size();
    }

    // Provide a direct reference to each of the views within a data item
    // Used to cache the views within the item layout for fast access
    public class ViewHolder extends RecyclerView.ViewHolder {
        RelativeLayout rlContainer;
        TextView tvName;
        TextView tvPhone;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            rlContainer = itemView.findViewById(R.id.rlContainer);
            tvName = itemView.findViewById(R.id.tvName);
            tvPhone = itemView.findViewById(R.id.tvPhone);

        }

        public void bind(Hospital hospital) {
            tvName.setText(hospital.getName());
            tvPhone.setText(hospital.getPhone());
            // Setting up intents to navigate to detail activity
            rlContainer.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    // first parameter is the context, second is the class of the activity to launch
                    Intent i =  new Intent(context, DetailsActivity.class);
                    i.putExtra("hospital", Parcels.wrap(hospital));
                    context.startActivity(i);
                }
            });

        }


    }
}
